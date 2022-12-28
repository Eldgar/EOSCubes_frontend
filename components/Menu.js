import { useStore } from "../hooks/useStore"
import * as React from 'react'
import { JsonRpc } from 'eosjs'
import { withUAL } from 'ual-reactjs-renderer/dist/components/provider/withUAL';
import { useState, useEffect } from 'react'



const Menu = (props) => {
    const [activeAuthenticator, setActiveAuthenticator] = useState(null)
	const [userBalance, setUserBalance] = useState(null)
    const [rpc, setRpc] = useState(new JsonRpc(`https://waxtest.defibox.xyz:443`))
	const [saveWorld, resetWorld, accountName, ual, setUal, setSaphireCube, setRubyCube, setPortalCube, setAccountName] = useStore((state) => 
	[state.saveWorld, state.resetWorld, state.accountName, state.ual, state.setUal, state.setSaphireCube,state.setRubyCube, state.setPortalCube, state.setAccountName])



	
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
				quantity: amount + " WAX"
			}
		}],
    }
	try {
		await activeUser.signTransaction(transaction, {broadcast: true})
	  }
	  catch (error) {
		console.log(error);
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
				to: 'eldgarcube12',
				quantity: amount + " WAX",
				memo: 'cubes contract'
			}
		}]
    }
	try {
		console.log(ual)
		console.log(activeUser)
		console.log(activeUser.chainId)
		await ual.activeUser.signTransaction(transaction, {broadcast: true})
	  }
	  catch(error) {
		console.log(error);
	  }
}
	return (
	<div className="menu absolute">
		<div className="top">
			<div className="save">
				<button onClick={() => saveWorld()}>Save</button>
				<h6></h6>
			</div>

			{ual ?
			<div className="balance" >
					<div className="deposit_withdraw">
						<button onClick={() => depositTokens("10.00000000")}>Deposit</button>
						<button onClick={() => withdrawTokens("10.0000000")}>Withdraw</button>
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