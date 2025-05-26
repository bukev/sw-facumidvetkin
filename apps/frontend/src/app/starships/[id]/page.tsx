'use client';
import type { Starship } from '@bukev/types';
import useFetchDetail from 'src/hooks/useFetchDetail';
import { Animator } from '@arwes/react-animator';
import { Text } from '@arwes/react-text';
import Info from 'src/components/Info';
import RelatedEntities from 'src/components/RelatedEntities';
import Loading from 'src/components/Loading';

const StarshipDetailPage: React.FC = () => {
  const { data: starship, loading, error } = useFetchDetail<Starship>();

  if (error) return <p>Starship Not Found.</p>;

  if (loading || !starship) return <Loading fullScreen />;

  const {
    name,
    model,
    manufacturer,
    cost_in_credits,
    length,
    max_atmosphering_speed,
    crew,
    passengers,
    cargo_capacity,
    consumables,
    hyperdrive_rating,
    MGLT,
    starship_class,
    pilots,
    movies,
  } = starship;

  return (
    <main>
      <Animator active={true} duration={{ enter: 1.5, offset: 10 }}>
        <Text as="h1">{name}</Text>

        <hr />

        <Info
          data={{
            model,
            manufacturer,
            cost_in_credits,
            length,
            max_atmosphering_speed,
            crew,
            passengers,
            cargo_capacity,
            consumables,
            hyperdrive_rating,
            MGLT,
            starship_class,
          }}
        />

        <RelatedEntities type="movies" data={movies} />

        {pilots && <RelatedEntities type="characters" data={pilots} title="Pilots" />}
      </Animator>
    </main>
  );
};

export default StarshipDetailPage;
