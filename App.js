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
import { useStore } from "./hooks/useStore"
import './App.css';
import './Menu.css';
import Loading from './components/Loading';


function App() {
  const [loading, setLoading] = useStore((state) => 
	[state.loading, state.setLoading])

  const ourNetwork = {
    chainId: "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",
    rpcEndpoints: [{ protocol: 'https', host: "waxtest.defibox.xyz", port: '443' }]
  }

  const anchor = new Anchor([ourNetwork], {
    appName: 'Eldgar Craft',
    rpc: new JsonRpc(`${ourNetwork.rpcEndpoints.protocol}://$
    {ourNetwork.rpcEndpoints.host}:${ourNetwork.rpcEndpoints.port}`),
    service: 'https://cb.anchor.link',
    disableGreymassFuel: false,
    requestStatus: false
  })
  /*const ourNetwork = {
    chainId: "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840",
    rpcEndpoints: [{ protocol: 'https', host: "jungle3.cryptolions.io", port: '443' }]
  }

  const anchor = new Anchor([ourNetwork], {
    appName: 'OrderEntryApp',
    rpc: new JsonRpc(`${ourNetwork.rpcEndpoints.protocol}://$
    {ourNetwork.rpcEndpoints.host}:${ourNetwork.rpcEndpoints.port}`),
    service: 'https://cb.anchor.link',
    disableGreymassFuel: false,
    requestStatus: false
  })*/
  return (
    loading ?
    <UALProvider
      chains = {[ourNetwork]}
      authenticators={[anchor]}
      appName={'EOS Cubes'}
      ourNetwork={(ourNetwork)}>
      <Loading />
    </UALProvider>
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
