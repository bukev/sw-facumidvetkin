'use client';
import type { ListResponse } from '@bukev/types';
import Card from 'src/components/Card';

type Props = {
  item: ListResponse['data'][number];
};

const MovieListItem: React.FC<Props> = ({ item }) => {
  const date = new Date(item.releaseDate as string);
  const year = date.getFullYear();

  return (
    <Card
      id={item.id}
      title={`Episode ${item.episode}: ${item.title} (${year})`}
      subtitle={item.director}
      type="movies"
    />
  );
};

export default MovieListItem;
