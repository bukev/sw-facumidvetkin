'use client';
import Section from '../../components/Section';
import StarshipListItem from './StarshipListItem';

export default function StarshipsPage() {
  return (
    <main>
      <Section entity="starships" ListItemComponent={StarshipListItem} />
    </main>
  );
}
