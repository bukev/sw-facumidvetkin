'use client';
import type { ListResponse } from '@bukev/types';
import Card from 'src/components/Card';

type Props = {
  item: ListResponse['data'][number];
};

const CharacterListItem: React.FC<Props> = ({ item }) => {
  return <Card id={item.id} title={item.name} subtitle={item.homeworld} type="characters" />;
};

export default CharacterListItem;
