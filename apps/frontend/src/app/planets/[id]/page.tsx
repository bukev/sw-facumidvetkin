'use client'
import type { Planet } from "@bukev/types";
import useFetchDetail from "src/hooks/useFetchDetail";
import { Animator } from '@arwes/react-animator';
import { Text } from '@arwes/react-text';
import Info from "src/components/Info";
import RelatedEntities from "src/components/RelatedEntities";
import Loading from "src/components/Loading";

const PlanetDetailPage: React.FC = () => {
    const { data: planet, loading, error } = useFetchDetail<Planet>();

    if (error) return (
        <p>Planet Not Found.</p>
    )

    if (loading || !planet) return (
        <Loading fullScreen />
    )

    const {
        name,
        rotation_period,
        orbital_period,
        diameter,
        climate,
        gravity,
        terrain,
        surface_water,
        population,
        residents,
        movies,
    } = planet;

    return (
        <main>
            <Animator active={true} duration={{ enter: 1.5, offset: 10 }}>
                <Text as="h1">
                    {name}
                </Text>

                <hr />

                <Info
                    data={{
                        name,
                        rotation_period,
                        orbital_period,
                        diameter,
                        climate,
                        gravity,
                        terrain,
                        surface_water,
                        population,
                    }}
                />

                <RelatedEntities
                    type="characters"
                    data={residents}
                    title="Residents"
                />
                
                <RelatedEntities
                    type="movies"
                    data={movies}
                />
            </Animator>
        </main>
    );
}

export default PlanetDetailPage;