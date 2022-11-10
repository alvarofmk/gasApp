export interface Municipality {
    IDMunicipio: string;
    IDProvincia: string;
    IDCCAA: string;
    Municipio: string;
    Provincia: string;
    CCAA: string;
}

export interface MunicipalityResponse {
    "" : Municipality[];
}