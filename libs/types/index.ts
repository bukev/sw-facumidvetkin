export type ListResponse = {
    pageCount: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    //data: T[] | [];
    data: {
        id: string;
        name?: string;
        title?: string;
        homeworld?: string;
        episode?: number;
        director?: string;
        releaseDate?: string;
        population?: string;
        manufacturer?: string;
    }[];
}

type RelatedEntity = {
    id: string;
    name: string;
}

export type Character = {
    name: string; 
    height: string; 
    mass: string; 
    hair_color: string; 
    skin_color: string; 
    eye_color: string; 
    birth_year: string; 
    gender: string; 
    homeworld: RelatedEntity;
    films: RelatedEntity[]; 
    starships: RelatedEntity[]; 
    created: string; 
    edited: string; 
}

export type Movie = {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: RelatedEntity[];
    planets: RelatedEntity[];
    starships: RelatedEntity[];
}

export type Planet = {
    name: string;
    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
    residents: RelatedEntity[];
    films: RelatedEntity[];
}

export type Starship = {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    hyperdrive_rating: string;
    MGLT: string;
    starship_class: string;
    pilots: RelatedEntity[] | undefined;
    films: RelatedEntity[];
}
