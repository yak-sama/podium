import dynamic from 'next/dynamic';
import ReactList from 'react-list';
import { useEffect, useState } from 'react';
import { connect, fetchPosts, fetchSpace } from '~/logics';
import { IPost } from '../shared/tweet';
const TweetComponent = dynamic(() => import('../shared/tweet'), { ssr: false });
const TweetBox = dynamic(() => import('./tweet-box'), { ssr: false });

export interface ISpace {
  name: string;
}

const HomeCenterComponent = () => {

  const [tweets, setTweets] = useState<IPost[]>([])

  const [space, setSpace] = useState<ISpace>()

  const fetchData = async () => {
    await connect()
    fetchSpaceData()
    fetchTweetsData()
  }

  const fetchSpaceData = async () => {
    const data = await fetchSpace()
    const spaceData = {
      name: data?.content?.name
    }
    setSpace(spaceData as ISpace)
  }

  const fetchTweetsData = async () => {
    const data = await fetchPosts()
    const tweetsData = data.map((tweet) => {
      const { content, struct } = tweet
      return {
        id: struct.id.toString(),
        body: content?.body,
        title: content?.title,
        name: struct.owner.toString(),
        image: "/images/personal.jpg",
        date: Date.now(),
        likes: struct.upvotesCount.toNumber(),
        replies: 0,
        retweets: 0,
      }
    })
    setTweets(tweetsData as IPost[])
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div className="p-3 border-b border-white border-opacity-15 sticky top-0 bg-dark z-50">
        <span className="text-white text-xl font-extrabold">{space?.name}</span>
      </div>
      <TweetBox />
      <div>
        <ReactList
          type="variable"
          axis="y"
          length={tweets.length}
          itemRenderer={(idx, key) => <TweetComponent key={key} {...tweets[idx]} />}
        />
      </div>
    </div>
  );
};

export default HomeCenterComponent;
