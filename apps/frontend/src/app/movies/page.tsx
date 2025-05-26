'use client'
import Section from '../../components/Section';
import MovieListItem from './MovieListItem';

export default function MoviesPage() {
  return (
    <main>
      <Section
        entity='movies'
        ListItemComponent={MovieListItem}
      />
    </main>
  );
}
