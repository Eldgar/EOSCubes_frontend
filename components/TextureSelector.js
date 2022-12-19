import { useEffect, useState } from 'react'
import { useStore } from "../hooks/useStore"
import { useKeyboard } from "../hooks/useKeyboard"
import { dirtImg, grassImg, glassImg, logImg, woodImg, saphireImg, rubyImg, portalImg } from '../images/images'

const images = {
	dirt: dirtImg,
	grass: grassImg,
	glass: glassImg,
	wood: woodImg,
	log: logImg,
	saphire: saphireImg,
	ruby: rubyImg,
	portal: portalImg,
}

export const TextureSelector = () => {
	const [visible, setVisible] = useState(false)
	const [activeTexture, setTexture, ual, saphireCube, rubyCube, portalCube] = useStore((state) => 
	[state.texture, state.setTexture, state.ual, state.saphireCube, state.rubyCube, state.portalCube])
	const {
		dirt,
		grass,
		glass,
		wood,
		log,
		saphire,
		ruby,
		portal
	} = useKeyboard()
		useEffect(() => {
			const textures = {
				dirt,
				grass,
				glass,
				wood,
				log,
			}
			if (saphireCube) {
				textures.saphire = saphire;
			  }
			  
			if (rubyCube) {
				textures.ruby = ruby;
			  }
			  
			if (portalCube) {
				textures.portal = portal;
			  }
			const pressedTexture = Object.entries(textures).find(([k, v]) => v)
			if (pressedTexture) {
				setTexture(pressedTexture[0])
			}
		}, [setTexture, dirt, grass, glass, wood, log, saphire, ruby, portal])
	
	


	useEffect(() => {
		const visibilityTimeout = setTimeout(() => {
			setVisible(false)
		}, 2000)
		setVisible(true)
		return () => {
			clearTimeout(visibilityTimeout)
		}
	}, [activeTexture])

	return visible && (
		<div className='absolute centered texture-selector'>
			{Object.entries(images).map(([k, src]) => {
				return (<img
					key={k}
					src={src}
					alt={k}
					className={`${k === activeTexture ? 'active' : ''}`}
				/>)
			})}
		</div>
	)
}