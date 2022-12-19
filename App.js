import { Canvas } from '@react-three/fiber';
import {  Sky } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground'
import { Player } from './components/Player'
import { FPV } from './components/FPV'
import { Cubes } from './components/Cubes'
import { TextureSelector } from './components/TextureSelector';
import Menu from './components/Menu'
import { UALProvider } from 'ual-reactjs-renderer';
//import { Ledger } from 'ual-ledger';
import { Anchor } from 'ual-anchor';
import { JsonRpc } from 'eosjs';
import React, { useEffect, useState } from 'react';
import CircleLoader from "react-spinners/ClipLoader";
import './App.css';
import './Menu.css';


function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true)
    setTimeout(() =>{
      setLoading(false);
    }, 4000)
  }, [])

  const ourNetwork = {
    chainId: "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840",
    rpcEndpoints: [{ protocol: 'https', host: "jungle3.cryptolions.io", port: '443' }]
  }

  const anchor = new Anchor([ourNetwork], {
    appName: 'Eldgar Craft',
    rpc: new JsonRpc(`${ourNetwork.rpcEndpoints.protocol}://$
    {ourNetwork.rpcEndpoints.host}:${ourNetwork.rpcEndpoints.port}`),
    service: 'https://cb.anchor.link',
    disableGreymassFuel: false,
    requestStatus: false
  })
  return (
      loading ?
      <div className="App">
      <h2>Loading...</h2>
      <CircleLoader
      color={"#FF7AF4"}
      loading={loading}
      size={375}
    />
    <h3>Controls</h3>
      <p>Move: WASD</p>
      <p>Select Blocks: 1, 2, 3, 4, 5, 6, 7, 8</p>
      <p>Click the screen to begin and esc to select buttons</p> 
    </div>

    :
    <>
      <Canvas>
        <Sky sunPosition={[100, 120, 25]} />
        <ambientLight intensity={0.45} />
        <FPV />
        <Physics>
          <Player />
          <Cubes />
          <Ground />
        </Physics>
      </Canvas>
      <div className='absolute centered cursor'>+</div>
      <TextureSelector />
      <UALProvider
        chains = {[ourNetwork]}
        authenticators={[anchor]}
        appName={'EOS Cubes'}
        ourNetwork={(ourNetwork)}>
        <Menu />
      </UALProvider>
    </> 
  );
}

export default App;
//Footer
