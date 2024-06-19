export type Medewerker = {
    id: string
    attributes: {
        voornaam: string
        tussenvoegsels: string
        achternaam: string
        aanwezigheid: "aanwezig" | "afwezig" | "extern"
    }
}