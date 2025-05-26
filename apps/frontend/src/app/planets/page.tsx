'use client'
import Section from '../../components/Section';
import PlanetListItem from './PlanetListItem';

export default function PlanetsPage() {
  return (
    <main>
      <Section
        entity='planets'
        ListItemComponent={PlanetListItem}
      />
    </main>
  );
}
