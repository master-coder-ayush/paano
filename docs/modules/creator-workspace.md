# Creator workspace

Creator workspace navigation includes My Card and profile settings. Protected pages resolve the demo authenticated identity and creator workspace before rendering. Profile mutations use the bearer-token contract and are ownership-scoped to the active creator workspace. Empty profile, invalid input, and unavailable public card states are represented in the UI. Future review/payout fields must retain workspace and creator ownership and produce audit activity when state transitions are introduced.
## Sprint 6

Creator collaboration requests and messages are scoped to the authenticated creator workspace. Creators may accept or decline only their own invited requests; unrelated brand records are not returned.
