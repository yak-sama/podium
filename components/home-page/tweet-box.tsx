import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
// import sanitizeHtml from 'sanitize-html';
import { useState } from 'react';
import Link from 'next/link';
import Gallery from '../../svgs/gallery.svg';
import Gif from '../../svgs/gif.svg';
import Poll from '../../svgs/poll.svg';
import Emoji from '../../svgs/emojis.svg';
import Schedule from '../../svgs/schedule.svg';
import styles from './styles/tweet-box.module.css';
import { createSpace, post, subscribeToSpace } from '~/logics';

export interface IPostSubmission {
  body: string;
  title: string;
  image: string;
}

const isEmpty = (postSubmission: IPostSubmission) => {
  return postSubmission.body.length === 0 && postSubmission.title.length === 0;
}

function emptyPostSubmission(): IPostSubmission {
  return {
    body: '',
    title: '',
    image: ''
  };
}

const TweetBox: React.FC = () => {
  const [postSubmissionData, setPostSubmission] = useState<IPostSubmission>(emptyPostSubmission());

  const onTweetBtnClick = async () => {
    if (postSubmissionData) {
      await post(postSubmissionData)
    }
    setPostSubmission(emptyPostSubmission())
  }

  const updateTitleData = async (e: ContentEditableEvent) => {
    setPostSubmission({
      body: postSubmissionData.body,
      title: e.target.value,
      image: postSubmissionData.image
    })
  };

  const updateBodyData = async (e: ContentEditableEvent) => {
    setPostSubmission({
      body: e.target.value,
      title: postSubmissionData.title,
      image: postSubmissionData.image
    })
  };
  return (
    <div>
      <div className="px-3 pt-3 pb-2 flex flex-wrap">
        <Link href="/mhmdou1">
          <a className="flex-shrink-0 h-12 w-12">
            <div className="relative">
              <div className="absolute anim left-0 right-0 top-0 bottom-0 z-10 hover:bg-black rounded-full hover:bg-opacity-15"></div>
              <img
                src="/images/personal.jpg"
                alt="mhmdou1"
                className="rounded-full min-w-full asd h-12 w-12"
              />
            </div>
          </a>
        </Link>
        <div id="tweet-box" className="flex-grow px-2 pt-3 pb-1 relative">
          <div className="px-2">
          <div className="pointer-events-none absolute text-gray-600 max-h-full text-lg">
              {isEmpty(postSubmissionData) && "Title"}
            </div>

            <ContentEditable
              aria-multiline="true"
              aria-autocomplete="list"
              aria-describedby="tweet-box"
              spellCheck
              tagName="div"
              className="text-white text-lg w-full focus:outline-none select-text whitespace-pre-wrap break-all inline-block"
              onChange={updateTitleData}
              html={postSubmissionData.title}></ContentEditable>


            <div className="pointer-events-none absolute text-gray-600 max-h-full text-lg">
              {isEmpty(postSubmissionData) && "Body"}
            </div>

            <ContentEditable
              aria-multiline="true"
              aria-autocomplete="list"
              aria-describedby="tweet-box"
              spellCheck
              tagName="div"
              className="text-white text-lg w-full focus:outline-none select-text whitespace-pre-wrap break-all inline-block"
              onChange={updateBodyData}
              html={postSubmissionData.body}></ContentEditable>
          </div>
          <div className="flex flex-wrap justify-between mt-5">
            <div className="flex items-center">
              <button className={styles.actionbtn}>
                <Gallery height="1.5rem" />
              </button>
              <button className={styles.actionbtn}>
                <Gif height="1.5rem" />
              </button>
              <button className={styles.actionbtn}>
                <Poll height="1.5rem" />
              </button>
              <button className={styles.actionbtn}>
                <Emoji height="1.5rem" />
              </button>
              <button className={styles.actionbtn}>
                <Schedule height="1.5rem" />
              </button>
            </div>
            <div className="">
              <button
                onClick={onTweetBtnClick}
                disabled={isEmpty(postSubmissionData)}
                className={`text-white px-4 py-2 shadow-sm focus:outline-none font-bold bg-primary rounded-full ${isEmpty(postSubmissionData)  ? 'cursor-not-allowed opacity-50' : ''
                  }`}>
                Tweet
              </button>
            </div>
            <div className="">
              <button
                onClick={subscribeToSpace}
                disabled={false}
                className={`text-white px-4 py-2 shadow-sm focus:outline-none font-bold bg-primary rounded-full}`}>
                Follow Space
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-2 bg-gray-100 w-full bg-opacity-15"></div>
    </div>
  );
};

export default TweetBox;
