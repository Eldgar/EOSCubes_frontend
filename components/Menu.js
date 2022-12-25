import { useStore } from "../hooks/useStore"
import * as React from 'react'
import { JsonRpc } from 'eosjs'
import { withUAL } from 'ual-reactjs-renderer/dist/components/provider/withUAL';
import { useState, useEffect } from 'react'



const Menu = (props) => {
    const [activeAuthenticator, setActiveAuthenticator] = useState(null)
	const [userBalance, setUserBalance] = useState(null)
    const [rpc, setRpc] = useState(new JsonRpc(`https://waxtest.api.eosnation.io:443`))
	const [saveWorld, resetWorld, accountName, ual, setUal, setSaphireCube, setRubyCube, setPortalCube, setAccountName] = useStore((state) => 
	[state.saveWorld, state.resetWorld, state.accountName, state.ual, state.setUal, state.setSaphireCube,state.setRubyCube, state.setPortalCube, state.setAccountName])


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
			 const username = await props.ual.activeUser.accountName
			 console.log(username)
			 const activeAuthenticator = await props.ual.activeAuthenticator
			 const ual = await props.ual
			 const activeUser = ual.activeUser
			 console.log(ual.activeUser.accountName)
			  setAccountName(username)
			  //setActiveUser(activeUser)
			  console.log(accountName + 'testing')
			  setActiveAuthenticator(activeAuthenticator)
			  setUal(ual);
		  }
		  userId()

		const getNFTs = async() => {
			const response = await new JsonRpc(`https://waxtest.api.eosnation.io:443`).get_table_rows({
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
		  console.log(data)
		  
		}
		getNFTs()
		const  fetchData = async() => {
			const response = await new JsonRpc(`https://waxtest.api.eosnation.io:443`).get_table_rows({
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
		  
		}
		fetchData()
		  
	 },[props.ual])


const withdrawTokens = async (amount) => {
	const activeUser = ual.activeUser
	console.log(accountName)
	console.log(activeUser)
    const transaction = {
    	actions: [{
			account: 'eldgarcube12',
			name: 'withdraw',
			authorization: [{
				actor: accountName,
				permission: 'active',
			}],
			data: {
				username: accountName,
				quantity: amount + " EOS"
			}
		}],
    }
	try {
		await activeUser.signTransaction(transaction, {broadcast: true})
	  }
	  catch {
		console.log('error');
	}
}

const depositTokens = async (amount) => {
	const activeUser = ual.activeUser
	const transaction = {
    	actions: [{
			account: 'eosio.token',
			name: 'transfer',
			authorization: [{
				actor: accountName,
				permission: 'active',
			}],
			data: {
				from: accountName,
				to: 'eldgarcube11',
				quantity: amount + " EOS",
				memo: 'cubes contract'
			}
		}]
    }
	try {
		await activeUser.signTransaction(transaction, {broadcast: true})
	  }
	  catch {
		console.log('error');
	  }
}

	return (
	<div className="menu absolute">
		<div className="top">
			<div className="save">
				<button onClick={() => saveWorld()}>Save</button>
				<h6></h6>
			</div>

			{userBalance ?
			<div className="balance" >
					<div className="deposit_withdraw">
						<button onClick={() => depositTokens("10.0000")}>Deposit</button>
						<button onClick={() => withdrawTokens("10.0000")}>Withdraw</button>
					</div>
				<h6>{userBalance}</h6>
			</div> : <h6></h6>}

			<div className="log">
				{!accountName ? <button onClick={props.ual.showModal}>Login</button> : <button onClick={props.ual.logout}>Logout</button>}
				<h6></h6>
			</div>
			
		</div>
		
		
		
		{!accountName ? <div style={{ textAlign: 'center', padding: '5px' }}>
                <h2>Welcome!</h2> 
    	</div> : 
		<div style={{ textAlign: 'center', padding: '5px' }}>
            <h2>{accountName}</h2>
			
        </div>}
	</div>)
}

export default withUAL(Menu)