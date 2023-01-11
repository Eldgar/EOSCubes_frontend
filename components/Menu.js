import { useStore } from "../hooks/useStore"
import * as React from 'react'
import { JsonRpc } from 'eosjs'
import { withUAL } from 'ual-reactjs-renderer/dist/components/provider/withUAL';
import { useState, useEffect } from 'react'



const Menu = (props) => {
	const contractName = 'eldgarcube12'
	const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
    const [activeAuthenticator, setActiveAuthenticator] = useState(null)
    const [rpc, setRpc] = useState(new JsonRpc(`https://waxtest.defibox.xyz:443`))
	const [saveWorld, resetWorld, accountName, userBalance, ual, setUal, setAccountName, setLoading, loading, cubes] = useStore((state) => 
	[state.saveWorld, state.resetWorld, state.accountName, state.userBalance, state.ual, state.setUal, state.setAccountName, state.setLoading, state.loading, state.cubes])

	
	function findRemovedCubes(cubes, blockchainCubes){
		console.log("Find Removed Cubes Function")
		const blockchainCubesId = []
		const localCubesId = []
		const removedCubesId = []
		for (let i = 0; i < blockchainCubes.rows.length; i++ ){
			blockchainCubesId.push(blockchainCubes.rows[i].id)
		}
		for (let i = 0; i < cubes.length; i++ ){
			// new cubes are locally stored without ID, this will check to see what local cubes were loaded from the blockchain
			if (cubes[i].id || cubes[i].id === 0){
				localCubesId.push(cubes[i].id)
			}
			
		}
		for (let i = 0; i < blockchainCubesId.length; i++ ){
			if (!localCubesId.includes(blockchainCubesId[i], 0))
			removedCubesId.push(blockchainCubesId[i])
		}
		console.log('Local Cubes ID')
		console.log(localCubesId)
		console.log("Removed Cubes IDs")
		console.log(removedCubesId)
		return removedCubesId
	}

	const saveToBlockchain = async () => {
		//console.log(cubes)
		const newCubes = [];
		let removedCubesId = [];
		//console.log(removedCubesId)
		const bCubes = await new JsonRpc(`https://waxtest.defibox.xyz:443`).get_table_rows({
				json: true,
				code: contractName,
				scope: contractName,
				table: 'cubes',
				limit: 10000,
				reverse: false,
				show_payer: false
		})
		//console.log(bCubes)
		//uses IDs of blocks stored on the blockchain to see if they were removed when comparing to local storage
		setTimeout(() =>{
			removedCubesId = findRemovedCubes(cubes, bCubes)
			console.log("removed cubes ID test")
			console.log(removedCubesId)
		}, 200)
		
		
		console.log("Blockchain Cubes")
		console.log(bCubes)

		console.log("Local Storage Cubes")
		console.log(cubes)

		console.log("Removed Cubes")
		console.log(removedCubesId)
		
		
		//new array of cubes that weren't added to blockchain, id isn't stored locally
		for (let i = 0; i < cubes.length; i++ ){
			if (!cubes[i].id){
				newCubes.push(cubes[i])
				console.log(newCubes)
			}
		}
		//console.log(newCubes)
		const transaction = {
		  actions: [],
		}
		setTimeout(() =>{
			console.log(removedCubesId.length)
		// Pushes removed Cubes to the transaction
			for (let i = 0; i < removedCubesId.length; i++){
				console.log("push Transaction removed Cubes Test")
				console.log(removedCubesId[i])
				transaction.actions.push({
					account: contractName,
					name: 'removecube',
					authorization: [{
				  	actor: accountName,
				  	permission: 'active',	
					}],
			  	data: {
					id: removedCubesId[i],
					username: accountName,
			  }
			  })
		}
		// Pushes New Cubes to the transaction
		for (let i = 0; i < newCubes.length; i++ ){
			transaction.actions.push({
				account: contractName,
				name: 'addcube',
				authorization: [{
				  actor: accountName,
				  permission: 'active',
		
				}],
			  data: {
				username: accountName,
				key: newCubes[i].key,
				pos: newCubes[i].pos,
				texture: newCubes[i].texture
			  }
			  })
		}
		console.log('New Cubes')
		console.log(newCubes)
		console.log(transaction)
		}, 400)

		
		setTimeout( async () =>{
			try {
				await props.ual.activeUser.signTransaction(transaction, {broadcast: true})
			  }
			  catch (error){
				console.log(error);
			  }
		}, 1000)
	  }

const withdrawTokens = async (amount) => {
	const activeUser = ual.activeUser
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
		await props.ual.activeUser.signTransaction(transaction, {broadcast: true})
	  }
	  catch (error) {
		console.log(error);
	}
}

const login = () => {
	console.log(props.ual)
	//console.log("login")
	ual.showModal
	//ual.showModal
	//ual.showModal()
	//console.log(ual.showModal)
}

const logout = () => {
	props.ual.logout()
}

const save = () => {
	saveWorld()
}

const depositTokens = async (amount) => {
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
		//console.log(activeUser)
		//console.log(activeUser.chainId)
		//console.log(activeUser.accountName)
		await props.ual.activeUser.signTransaction(transaction, {broadcast: true})
	  }
	  catch(error) {
		console.log(error);
	  }
}
	return (
	accountName ? 
	<div className="menu absolute">
		<div className="top">
			<div className="save">
				<button onClick={saveToBlockchain}>Save</button>
				<h6></h6>
			</div>

			<div className="balance" >
					<div className="deposit_withdraw">
						<button onClick={() => depositTokens("10.00000000")}>Deposit</button>
						<button onClick={() => withdrawTokens("10.00000000")}>Withdraw</button>
					</div>
				<h6>{userBalance}</h6>
			</div>

			<div className="log">
				<button onClick={logout}>Logout</button>
				<h6></h6>
			</div>
			
		</div>
		<div style={{ textAlign: 'center', padding: '5px' }}>
            <h2>{accountName}</h2>
			
        </div>
	</div> : <h2></h2>)
}

export default withUAL(Menu)