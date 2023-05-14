import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { homeClubTabState, postsState } from "../store";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://cbnucore.site";

export default function HomeClubList() {
  const [posts, setPosts] = useRecoilState(postsState);
  const [homeTab, setHomeTab] = useRecoilState(homeClubTabState);
  const navigation = useNavigate();

  const getPosts = () => {
    if (homeTab == 0) {
      axios.get("/api/posts/?skip=0&limit=8").then((res) => {
        setPosts(res.data);
      });
    } else if (homeTab == 1) {
      axios
        .get("/api/posts/classification/?skip=0&limit=8&classification=0")
        .then((res) => {
          setPosts(res.data);
        });
    } else if (homeTab == 2) {
      axios
        .get("/api/posts/classification/?skip=0&limit=8&classification=1")
        .then((res) => {
          setPosts(res.data);
        });
    }
  };

  useEffect(getPosts, [homeTab]);

  return (
    <>
      <div className={"px-8 2xl:px-16"}>
        <HomeClubTab />
        <article className={"w-home2 2xl:w-home"}>
          <div className={"grid grid-cols-4 gap-10"}>
            {posts.map((post) => {
              return (
                <div
                  className={
                    "w-[200px] h-[240px] 2xl:w-[300px] 2xl:h-[320px] bg-white shadow-lg transition hover:scale-110"
                  }
                  onClick={() => {
                    // navigate('/detail/' + post._id);
                  }}
                >
                  <Image post={post} />
                  <Content post={post} />
                </div>
              );
            })}
          </div>
        </article>
        <div className={"mt-[48px]"} />
        <div className={"grid place-content-center"}>
          <button
            className={
              "w-[200px] h-[46px] text-h5 text-black rounded-3xl border border-gray"
            }
            onClick={() => {
              navigation("/club");
            }}
          >
            전체보기 >
          </button>
        </div>
      </div>
    </>
  );
}

const HomeClubTab = () => {
  const [homeTab, setHomeTab] = useRecoilState(homeClubTabState);

  const onClickHandler = (tabValue) => {
    setHomeTab(tabValue);
  };

  return (
    <>
      <div>
        <div className={"text-[32px] text-main"}>
          동아리 <span className={"font-bold"}>둘러보기</span>
        </div>
        <div className={"mt-[18px]"} />
        <div className={"flex gap-3"}>
          <button
            className={homeTab === 0 ? "btn-home-tab-focused" : "btn-home-tab"}
            onClick={() => onClickHandler(0)}
          >
            전체
          </button>
          <button
            className={homeTab === 1 ? "btn-home-tab-focused" : "btn-home-tab"}
            onClick={() => onClickHandler(1)}
          >
            중앙 동아리
          </button>
          <button
            className={homeTab === 2 ? "btn-home-tab-focused" : "btn-home-tab"}
            onClick={() => onClickHandler(2)}
          >
            직무 동아리
          </button>
        </div>
        <div className={"mt-[32px]"} />
      </div>
    </>
  );
};

const Image = (props) => {
  return (
    <div className={"2xl:w-[300px] 2xl:h-[200px]"}>
      <img src={props.post.image_url} alt="img" className={"rounded-t-lg"} />
    </div>
  );
};

const Content = (props) => {
  return (
    <div className={"p-2"}>
      <div className={"2xl:flex"}>
        <div className={"text-lg 2xl:text-xl font-bold"}>
          {props.post.title}
        </div>
        <div
          className={
            "text-md w-[115px] 2xl:w-[130px] 2xl:text-lg text-center 2xl:ml-3 text-md border border-darkgray text-darkgray rounded-xl px-3"
          }
        >
          {props.post.classification === 0 ? "중앙 동아리" : "직무 동아리"}
        </div>
      </div>
      <div className={"hidden 2xl:block"}>
        {props.post.content.length > 35
          ? props.post.content.slice(0, 35) + "..."
          : props.post.content}
      </div>
      <div className={"block 2xl:hidden text-sm"}>
        {props.post.content.length > 12
          ? props.post.content.slice(0, 12) + "..."
          : props.post.content}
      </div>
    </div>
  );
};
