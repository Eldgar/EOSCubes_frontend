import create from 'zustand'
import { nanoid } from 'nanoid'
import { JsonRpc } from 'eosjs'



const contractName = 'eldgarcube12'


const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
//const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))
/*const saveToBlockchain = async (ual, cubes) => {
	const [accountName, setAccountName] = useStore((state) => 
	[state.accountName, state.setAccountName])
	//console.log(cubes)
	const newCubes = [];
	const removedCubesId = [];
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
	function findRemovedCubes(cubes, blockchainCubes){
		const blockchainCubesId = []
		const localCubesId = []
		
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
		console.log(localCubesId)
	}
	findRemovedCubes(cubes, bCubes)
	console.log(cubes)
	console.log(removedCubesId)
	
	
	//new array of cubes that weren't added to blockchain, id isn't stored locally
	for (let i = 0; i < cubes.length; i++ ){
		if (!cubes[i].id){
			newCubes.push(cubes[i])
			console.log(newCubes)
		}
	}
	console.log(newCubes)
    const transaction = {
      actions: [],
    }
	for (let i = 0; i < removedCubesId.length; i++){
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
	
	console.log(transaction)
    try {
      await activeUser.signTransaction(transaction, {broadcast: true})
    }
    catch (error){
      console.log(error);
    }
  }
*/
 export const useStore = create((set, props) => ({
	loading: true,
	setLoading: (loading) => 
		set((state)=> ({
			...state,
			loading,
		})),
		
	ual: {},
	setUal: (ual) => 
	set((state)=> ({
		...state,
		ual,
	})),

	accountName: null,
	userBalance: 0,
	setUserBalance: (userBalance) => 
	set((state)=> ({
		...state,
		userBalance,
	})),
	texture: 'dirt',

	//set state for NFT cubes enable/disable
	saphireCube: false,
	rubyCube: false,
	portalCube: false,
	setSaphireCube: (saphireCube) => 
		set((state)=> ({
			...state,
			saphireCube,
		})),

	setRubyCube: (rubyCube) => 
		set((state)=> ({
			...state,
			rubyCube,
		})),

	setPortalCube: (portalCube) => 
		set((state)=> ({
			...state,
			portalCube,
		})),


	cubes: getLocalStorage('cubes'),
	
	addCube: (x, y, z, username) => {
		//console.log(JSON.parse(window.localStorage.getItem('cubes')))
		console.log(username)
		set((prev) => ({
			cubes: [
				...prev.cubes,
				{
					username: username,
					key: nanoid(),
					pos: [x, y, z],
					texture: prev.texture
				}
			]
		}))
	},
	removeCube: (x, y, z) => {
		//console.log(JSON.parse(window.localStorage.getItem('cubes')))
		set((prev) => ({
			cubes: prev.cubes.filter(cube => {
				const [X, Y, Z] = cube.pos
				return X !== x || Y !== y || Z !== z
			})

		}))
	},
	setTexture: (texture) => {
		set(() => ({
			texture
		})) 
	},
	setAccountName: (accountName) => {
		set(() =>({
			accountName
		}))
	},
	saveWorld: () => {
		set((prev) => {
		
			//setLocalStorage('cubes', prev.cubes)
			saveToBlockchain(prev.ual, prev.cubes)
		})
	},
	resetWorld: () => {
		
		set(() => ({
			cubes: []
		}))
	},
}))
