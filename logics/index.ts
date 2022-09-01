import { newFlatSubsocialApi } from '@subsocial/api'
import { FlatSubsocialApi } from '@subsocial/api/flat-subsocial'
import { ProfileData } from '@subsocial/types/dto'
import { bnsToIds } from '@subsocial/utils'
import config from './config'
import {
  IpfsContent,
  OptionBool,
  SpaceUpdate
} from "@subsocial/types/substrate/classes"

let flatApi: FlatSubsocialApi
let selectedAddress: string
let selectedProfile: ProfileData | undefined
const spaceId = '9940'

export const connect = async () => flatApi = await newFlatSubsocialApi({
  ...config,
  useServer: {
    httpRequestMethod: 'get'
  }
})

export const signAndSendTx = async (tx: any) => {
  const { isWeb3Injected, web3Enable, web3AccountsSubscribe, web3FromAddress } = await import('@polkadot/extension-dapp')
  const injectedExtensions = await web3Enable('twitter-dapp-subsocial')
  if (!isWeb3Injected) {
    alert('Browser do not have any polkadot extension')
    return;
  }

  if (!injectedExtensions.length) {
    alert('Polkadot Extension have not authorized us to get accounts');
    return;
  }

  await web3AccountsSubscribe(async (accounts) => {
    if (accounts.length > 0) {
      const addresses = accounts.map((account) => account.address)

      const { signer } = await web3FromAddress(addresses[0])
      await tx.signAsync(addresses[0], { signer })

      await tx.send((result: any) => {
        const { status } = result

        if (!result || !status) {
          return;
        }
        if (status.isFinalized || status.isInBlock) {
          const blockHash = status.isFinalized
            ? status.asFinalized
            : status.asInBlock;
          console.log('✅ Tx finalized. Block hash', blockHash.toString());
        } else if (result.isError) {
          console.log(JSON.stringify(result));
        } else {
          console.log('⏱ Current tx status:', status.type);
        }
      })

    }
  })
}

export const fetchProfile = async (address: string) => {
  const accountId = address
  const profile = await flatApi.findProfile(accountId)
  console.log(profile)
  selectedAddress = address
  selectedProfile = profile
}

export const fetchPosts = async () => {
  const postIds = await flatApi.subsocial.substrate.postIdsBySpaceId(spaceId as any)

  const posts = await flatApi.subsocial.findPosts({ ids: postIds })

  console.log(posts)
  return posts
}

export const fetchSpace = async () => {
  const space = await flatApi.subsocial.findSpace({ id: spaceId as any })
  console.log("space", space)
  return space
}

export const subscribeToSpace = async() => {
  // const substrateApi = await flatApi.subsocial.substrate.api

  // const res = await substrateApi.query.spaceFollows.spacesFollowedByAccount('3tP6YGBggyekuJDkEG6mn6busH5wXFe2Z21Z3uP8qWiFLtoP') as Vec<SubstrateSpaceId>
  // const followedSpaceIds = bnsToIds(res)

  // console.log(followedSpaceIds)


  // const tx = substrateApi.tx.spaceFollows.followSpace(spaceId)

  // console.log(tx)

  // signAndSendTx(tx)
}

export const createSpace = async () => {
  // const spaceIds = await flatApi.subsocial.substrate.spaceIdsByOwner("3tP6YGBggyekuJDkEG6mn6busH5wXFe2Z21Z3uP8qWiFLtoP")
  // // const prof = flatApi.findProfile('3tP6YGBggyekuJDkEG6mn6busH5wXFe2Z21Z3uP8qWiFLtoP')

  // // console.log(prof)
  // const spaces = await flatApi.subsocial.findSpaces({ids: spaceIds})
  // // console.log(spaceIds)
  // // console.log(spaceIds[0].toBigInt())
  // const spaceId = spaces.at(1)?.struct.id

  // console.log(spaceId?.toNumber())
  // const cid = await flatApi.subsocial.ipfs.saveContent({
  //   about: 'Yak Space',
  //   name: 'Yak Space',
  //   tags: ['yak', 'space']
  // } as any)

  // console.log(cid)

  // const substrateApi = await flatApi.subsocial.substrate.api

  // const spaceTransaction = substrateApi.tx.spaces.createSpace(
  //   IpfsContent(cid),
  //   null // Permissions config (optional)
  // )

  // // console.log(cid)

  // console.log(spaceTransaction)

  // // signAndSendTx(spaceTransaction)

}

export const postTweet = async (tweet: string) => {
  const cid = await flatApi.subsocial.ipfs.saveContent({
    title: selectedProfile ? selectedProfile.content?.name : selectedAddress,
    body: tweet,
    avatar: selectedProfile ? selectedProfile.content?.avatar : ''
  })

  const substrateApi = await flatApi.subsocial.substrate.api
  const postTransaction = substrateApi.tx.posts.createPost(
    spaceId, 
    { RegularPost: null }, // Creates a regular post.
    IpfsContent(cid)
  )
  signAndSendTx(postTransaction)
}

export const likeTweet = async (tweetId: string) => {
  const substrateApi = flatApi.subsocial.substrate.api

  const reactionTx = (await substrateApi).tx.reactions.createPostReaction(tweetId, 'Upvote')
  signAndSendTx(reactionTx)
}

// 0xca47806e41512700caef2f139e530c80e3a32b06d404c9d5484148603b49bdec