'use client';
import { Text } from '@arwes/react';
import Card from 'src/components/Card';

export default function Home() {
  return (
    <main className="home">
      <Text as="h1" manager="sequence">
        Star Wars Codex
      </Text>

      <hr />

      <div className="box-list-grid">
        <Card id={1} title="Movies" type="movies" overrideNavigation="/movies" />
        <Card id={2} title="Characters" type="characters" overrideNavigation="/characters" />
        <Card id={3} title="Planets" type="planets" overrideNavigation="/planets" />
        <Card id={4} title="Starships" type="starships" overrideNavigation="/starships" />
      </div>
    </main>
  );
}
