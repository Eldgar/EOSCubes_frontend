import * as React from 'react'
import { JsonRpc } from 'eosjs'
import { withUAL } from 'ual-reactjs-renderer/dist/components/provider/withUAL';
import { useState, useEffect } from 'react'
import { useStore } from '../hooks/useStore'

const Loading = (props) => {
	const [username, setUsername] = useState('')
	const [ruby, setRuby] = useState(false)
	const [saphire, setSaphire] = useState(false)
	const [portal, setPortal] = useState(false)
	const [balance, setBalance] = useState(0)
	const [accountName, setAccountName, setSaphireCube, setRubyCube, setPortalCube, setUserBalance, setLoading] = useStore((state) => 
	[state.accountName, state.setAccountName, state.setSaphireCube, state.setRubyCube, state.setPortalCube, state.setUserBalance, state.setLoading])
	const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))
	const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
    
	
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

	const getNFTs = async() => {
		const response = await new JsonRpc(`https://waxtest.eosdac.io:443`).get_table_rows({
		json: true,
		code: 'atomicassets',
		scope: username,
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
			setSaphire(true);
		  }
		if (data[i].template_id === 604080){
			console.log('ruby')
			setRuby(true);
		  }
		if (data[i].template_id === 604081){
			console.log('portal')
			setPortal(true);
		  }
	  }
	  console.log(data)
	}

	const  fetchData = async() => {
		console.log(" is the balance")
		const response = await new JsonRpc(`https://waxtest.eosdac.io:443`).get_table_rows({
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
		if (data[i].user === nameToUint64(username)){
			setBalance(data[i].balance)
		} 
	  }
	  //console.log("no user found")
	  
	}

	const logout = () => {
		props.ual.logout();
		setAccountName('')
		counter = 0;
		console.log(getLocalStorage('anchor-link-.ldgar..raft-list')[0].auth.actor)
	}

	const enter = () => {
		setAccountName(username)
		setRubyCube(ruby)
		setSaphireCube(saphire)
		setPortalCube(portal)
		setUserBalance(balance)
		setTimeout(() =>{
			setLoading(false)
		}, 500)
	}

	let counter = 0;
		useEffect(() => {
			if (counter < 4){
				console.log(props.ual.activeUser)
				if (props.ual.activeUser && getLocalStorage('anchor-link-.ldgar..raft-list')[0].auth.actor){
					setUsername(getLocalStorage('anchor-link-.ldgar..raft-list')[0].auth.actor)
					fetchData()
					getNFTs()
					console.log(getLocalStorage('anchor-link-.ldgar..raft-list')[0].auth.actor)
					
				}
			counter++
			console.log(counter)
			console.log(username)
			}
		
		}, [counter, props.ual])

  return (
    <div className="App">
        <h2>{username}</h2>
		<button onClick={enter}>Enter</button>
		{ username ? <button onClick={logout}>Logout</button> : <button onClick={props.ual.showModal}>Login</button> }
    	<h3>Controls</h3>
      	<p>Move: WASD</p>
      	<p>Select Blocks: 1, 2, 3, 4, 5, 6, 7, 8</p>
      	<p>Click the screen to begin and esc to select buttons</p> 
    </div>
  )
}

export default withUAL(Loading)