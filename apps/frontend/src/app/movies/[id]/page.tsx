'use client'
import type { Movie } from "@bukev/types";
import useFetchDetail from "src/hooks/useFetchDetail";
import { Animator } from '@arwes/react-animator';
import { Text } from '@arwes/react-text';
import Info from "src/components/Info";
import RelatedEntities from "src/components/RelatedEntities";
import Loading from "src/components/Loading";

const MovieDetailPage: React.FC = () => {
    const { data: movie, loading, error } = useFetchDetail<Movie>();

    if (error) return (
        <p>Movie Not Found.</p>
    )

    if (loading || !movie) return (
        <Loading fullScreen />
    )

    const {
        title,
        episode_id,
        director,
        producer,
        opening_crawl,
        characters,
        planets,
        starships
    } = movie;

    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <main>
            <Animator active={true} duration={{ enter: 1.5, offset: 10 }}>
                <Text as="h1">
                    Episode {episode_id}: {title}
                </Text>

                <hr />

                <Text
                    style={{
                        margin: '24px 0 32px',
                        // textIndent: '36px',
                        textAlign: 'center',
                        lineHeight: '18px'
                    }}
                    manager="decipher"
                    fixed
                >
                    {opening_crawl}
                </Text>

                <Info
                    data={{
                        directed_by: director,
                        release_date: releaseDate,
                        produced_by: producer
                    }}
                />

                <RelatedEntities
                    type="characters"
                    data={characters}
                />

                <RelatedEntities
                    type="planets"
                    data={planets}
                />

                <RelatedEntities
                    type="starships"
                    data={starships}
                />
            </Animator>
        </main>
    );
}

export default MovieDetailPage;