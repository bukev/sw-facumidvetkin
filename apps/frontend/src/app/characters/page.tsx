'use client';
import Section from '../../components/Section';
import CharacterListItem from './CharacterListItem';

export default function CharactersPage() {
  return (
    <main>
      <Section entity="characters" ListItemComponent={CharacterListItem} />
    </main>
  );
}
