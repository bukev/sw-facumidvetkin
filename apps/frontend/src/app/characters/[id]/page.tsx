'use client';
import type { Character } from '@bukev/types';
import useFetchDetail from 'src/hooks/useFetchDetail';
import { Animator } from '@arwes/react-animator';
import { Text } from '@arwes/react-text';
import Info from 'src/components/Info';
import RelatedEntities from 'src/components/RelatedEntities';
import Loading from 'src/components/Loading';

const CharacterDetailPage: React.FC = () => {
  const { data: character, loading, error } = useFetchDetail<Character>();

  if (error) return <p>Character Not Found.</p>;

  if (loading || !character) return <Loading fullScreen />;

  const { gender, mass, height, skin_color, hair_color, eye_color } = character;

  return (
    <main>
      <Animator active={true} duration={{ enter: 1.5, offset: 10 }}>
        <Text as="h1">{character.name}</Text>

        <hr />

        <Info
          data={{
            gender,
            mass,
            height,
            skin_color,
            hair_color,
            eye_color,
          }}
        />

        <RelatedEntities type="planets" data={character.homeworld} title="Homeworld" />

        <RelatedEntities type="movies" data={character.movies} />

        {character.starships && <RelatedEntities type="starships" data={character.starships} />}
      </Animator>
    </main>
  );
};

export default CharacterDetailPage;
