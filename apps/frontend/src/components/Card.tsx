'use client';
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FrameNefrex, useFrameAssembler } from "@arwes/react-frames"
import { Animated, Animator, Text, useBleeps } from "@arwes/react";
import characterIcon from '../../public/character.svg'
import movieIcon from '../../public/movie.svg'
import planetIcon from '../../public/planet.svg'
import starshipIcon from '../../public/spaceship.svg'

type Props = {
    id: string | number;
    title?: string;
    subtitle?: string;
    type: 'characters' | 'movies' | 'planets' | 'starships';
    overrideNavigation?: string;
}

const Card: React.FC<Props> = ({ id, title, subtitle, type, overrideNavigation }) => {
    const router = useRouter();
    const elementRef = useRef<SVGSVGElement>(null)
    useFrameAssembler(elementRef)
    const bleeps = useBleeps()

    const svgSelector = {
        characters: characterIcon,
        movies: movieIcon,
        planets: planetIcon,
        starships: starshipIcon,
    }

    return (
        <Animator duration={{ enter: 1.5 }}>
            <Animated
                as="div"
                className="card"
                key={id}
                onMouseEnter={() => bleeps.hover?.play()}
                onClick={() => {
                    bleeps.click?.play()
                    if(overrideNavigation) {
                        router.push(overrideNavigation)
                    } else {
                        router.push(`/${type}/${id}`)
                    }
                }}
            >
                <FrameNefrex
                    elementRef={elementRef}
                    animated={false}
                />

                <Image src={svgSelector[type]} alt="" width={20} height={20}/>

                <div>
                    <Text
                        style={{fontWeight: 800}}
                        manager="decipher"
                        fixed
                    >
                        {title}
                    </Text>
                    
                    {subtitle &&
                        <Text
                            manager="decipher"
                            fixed                            
                        >
                            {subtitle}
                        </Text>
                    }
                </div>
            </Animated>
        </Animator>
    )
}

export default Card;