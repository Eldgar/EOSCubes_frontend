import { useStore } from "../hooks/useStore"
import * as React from 'react'
import { JsonRpc } from 'eosjs'
import { withUAL } from 'ual-reactjs-renderer/dist/components/provider/withUAL';
import { useState, useEffect } from 'react'
import CircleLoader from "react-spinners/ClipLoader";


const Loading = (props) => {

    const [activeAuthenticator, setActiveAuthenticator] = useState(null)
	const [userBalance, setUserBalance] = useState(null)
    const [rpc, setRpc] = useState(new JsonRpc(`https://waxtest.defibox.xyz:443`))
	const [loading, setLoading, accountName, ual, setUal, setSaphireCube, setRubyCube, setPortalCube, setAccountName] = useStore((state) => 
	[state.loading, state.setLoading, state.accountName, state.ual, state.setUal, state.setSaphireCube,state.setRubyCube, state.setPortalCube, state.setAccountName])

	
	function timeout(ms){
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	//
	const char_to_symbol = (c) => {
		if (typeof c == 'string') c = c.charCodeAt(0);
	  
		if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
		  return c - 'a'.charCodeAt(0) + 6;
		}
	  
		if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
		  return c - '1'.charCodeAt(0) + 1;
		}
	  
		return 0;
	};

	// converts string into an integer to be used for finding account balance
	const nameToUint64 = (s) => {
		let n = 0n;
	  
		let i = 0;
		for (; i < 12 && s[i]; i++) {
		  n |= BigInt(char_to_symbol(s.charCodeAt(i)) & 0x1f) << BigInt(64 - 5 * (i + 1));
		}
	  
		if (i == 12) {
		  n |= BigInt(char_to_symbol(s.charCodeAt(i)) & 0x0f);
		}
	  
		return n.toString();
	};



	useEffect(() => { 
		const userId = async() => {
			const ual = await props.ual
			const activeUser = ual.activeUser
			const username = ual.activeUser.accountName
			console.log(username)
			const activeAuthenticator = await props.ual.activeAuthenticator
			
			setAccountName(username)
			//setActiveUser(activeUser)
			console.log(accountName + 'testing')
			setActiveAuthenticator(activeAuthenticator)
			await timeout(4000)
			setUal(ual);
			setLoading(false)
			
		}
		userId()
		  
		  console.log(ual)
		  
		  
		  
	 },[props.ual])

	useEffect(() => {
		if(accountName){
			const getNFTs = async() => {
				const response = await new JsonRpc(`https://waxtest.defibox.xyz:443`).get_table_rows({
				json: true,
				code: 'atomicassets',
				scope: accountName,
				table: 'assets',
				limit: 10000,
				reverse: false,
				show_payer: false
			  })
			  const data = await response.rows;
			  for ( let i = 0; i < data.length; i++ ){
				console.log(data[i].template_id)
				if (data[i].template_id === 604079){
					console.log('saphire')
					setSaphireCube(true);
				  }
				if (data[i].template_id === 604080){
					console.log('ruby')
					setRubyCube(true);
				  }
				if (data[i].template_id === 604081){
					console.log('portal')
					setPortalCube(true);
				  }
			  }
			  await timeout(3000);
			  console.log(data)
			  
			}
			getNFTs()
			
			const  fetchData = async() => {
				const response = await new JsonRpc(`https://waxtest.defibox.xyz:443`).get_table_rows({
				json: true,
				code: 'eldgarcube12',
				scope: 'eldgarcube12',
				table: 'balances',
				limit: 10000,
				reverse: false,
				show_payer: false
			  })
			  const data = await response.rows
			  for (let i = 0; i < data.length; i++){
				if (data[i].user === nameToUint64(accountName)){
					setUserBalance(data[i].balance)
					return
				} 
			  }
			  //console.log("no user found")
			  await timeout(3000);
			}
			fetchData()
			setLoading(false)
		}
	},[accountName])


  return (
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
  )
}

export default withUAL(Loading)