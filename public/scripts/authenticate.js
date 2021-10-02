export async function authenticate() {
    const authed = await fetch('/api/authentication')
    .then(res => res.text())
    return authed;
}