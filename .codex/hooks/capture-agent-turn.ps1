$ErrorActionPreference = "Stop"

$stdinText = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($stdinText)) {
  exit 0
}

try {
  $event = $stdinText | ConvertFrom-Json
} catch {
  exit 0
}

$eventName = [string]$event.hook_event_name
if ($eventName -ne "UserPromptSubmit" -and $eventName -ne "Stop") {
  exit 0
}

$body = $null
$entryType = $null
if ($eventName -eq "UserPromptSubmit") {
  $body = [string]$event.prompt
  $entryType = "PROMPT"
} elseif ($eventName -eq "Stop") {
  $body = [string]$event.last_assistant_message
  $entryType = "RESPONSE"
}

if ([string]::IsNullOrEmpty($body)) {
  exit 0
}

$repoRoot = [string]$event.cwd
if ([string]::IsNullOrWhiteSpace($repoRoot)) {
  $repoRoot = (Get-Location).Path
}

$logDir = Join-Path $repoRoot ".agent-logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$sessionId = [string]$event.session_id
if ([string]::IsNullOrWhiteSpace($sessionId)) {
  $sessionId = "unknown-session"
}
$sessionShort = if ($sessionId.Length -gt 8) { $sessionId.Substring(0, 8) } else { $sessionId }
$model = [string]$event.model
if ([string]::IsNullOrWhiteSpace($model)) {
  $model = "unknown"
}

$statePath = Join-Path (Join-Path $repoRoot ".codex") "capture-state.json"
$state = @{}
if (Test-Path -LiteralPath $statePath) {
  try {
    $loaded = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    foreach ($property in $loaded.PSObject.Properties) {
      $state[$property.Name] = $property.Value
    }
  } catch {
    $state = @{}
  }
}

$now = (Get-Date).ToUniversalTime()
$timestamp = $now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", [Globalization.CultureInfo]::InvariantCulture)
$date = $now.ToString("yyyy-MM-dd", [Globalization.CultureInfo]::InvariantCulture)

if (-not $state.ContainsKey($sessionId)) {
  $fileStamp = $now.ToString("yyyy-MM-dd_HH-mm-ss", [Globalization.CultureInfo]::InvariantCulture)
  $safeSession = ($sessionId -replace '[^A-Za-z0-9_.-]', '-')
  $state[$sessionId] = [pscustomobject]@{
    file = "$fileStamp`_$safeSession.md"
    prompt_count = 0
    response_count = 0
    first_prompt_time = $timestamp
    last_prompt_time = $timestamp
  }
}

$sessionState = $state[$sessionId]
if ($entryType -eq "PROMPT") {
  $sessionState.prompt_count = [int]$sessionState.prompt_count + 1
  $entryNum = [int]$sessionState.prompt_count
  if ([string]::IsNullOrWhiteSpace([string]$sessionState.first_prompt_time)) {
    $sessionState.first_prompt_time = $timestamp
  }
  $sessionState.last_prompt_time = $timestamp
} else {
  $sessionState.response_count = [int]$sessionState.response_count + 1
  $entryNum = [int]$sessionState.response_count
}

$totalExchanges = [Math]::Max([int]$sessionState.prompt_count, [int]$sessionState.response_count)
$logPath = Join-Path $logDir ([string]$sessionState.file)

$frontMatter = @"
---
session_id: $sessionId
date: $date
author: Ayush
model: $model
tool: codex-desktop
project: naano-clone
total_exchanges: $totalExchanges
first_prompt_time: $($sessionState.first_prompt_time)
last_prompt_time: $($sessionState.last_prompt_time)
---

"@

$initialBody = @"
# Session Log - $date

Session: ``$sessionShort`` | Project: ``naano-clone`` | Author: ``Ayush``

---

"@

$existingEntries = ""
if (Test-Path -LiteralPath $logPath) {
  $existing = Get-Content -LiteralPath $logPath -Raw
  $match = [regex]::Match($existing, "(?s)^---\r?\n.*?\r?\n---\r?\n(.*)$")
  if ($match.Success) {
    $existingEntries = $match.Groups[1].Value
  } else {
    $existingEntries = $existing
  }
}

$bodyPrefix = if ([string]::IsNullOrEmpty($existingEntries)) { $initialBody } else { $existingEntries }

$entry = @"
[LOG_ENTRY type=$entryType num=$entryNum session=$sessionShort]
timestamp: $timestamp
model: $model

$body


"@

Set-Content -LiteralPath $logPath -Value ($frontMatter + $bodyPrefix + $entry) -Encoding UTF8

$state[$sessionId] = $sessionState
$state | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statePath -Encoding UTF8

exit 0
