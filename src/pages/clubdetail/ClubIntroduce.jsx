import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { readOneClub } from "../../api/club";
import { readAllPromotions, readOnePromotion } from "../../api/promotion";
import { baseUrl } from "../../common/global";
import { promotionsState, addingImgState } from "../../store";
import { useRecoilState } from "recoil";
import axios from "axios";
import Swal from "sweetalert2";

axios.defaults.baseURL = baseUrl;

export default function ClubIntroduce() {
  const { id } = useParams();
  const [posts, setPosts] = useState({ activity_tags: [], image_urls: [] });
  const [promotions, setPromotions] = useRecoilState(promotionsState);
  const [count, setCount] = useState(0);
  const [activity, setActivity] = useState([]); //동아리 주요활동 내역
  const [programs, setPrograms] = useState([]); //동아리 활동 프로그램 내역
  const [AddImg, setAddImg] = useRecoilState(addingImgState); //이미지 추가하는 모달 창 여는 변수
  let prev_length = 0; //주요활동내역의 년도 시각화에 필요한 변수1
  let list = []; //2
  let after_length = 0; //3
  const navigate = useNavigate();

  function getClubPost() {
    readOneClub(id).then((res) => setPosts(res.data[0]));
  }

  function getPromotionPost() {
    readAllPromotions(0).then((res) => setPromotions(res.data));
  }

  function getClubActivityHistory() {
    //주요활동내역 가져옴
    axios
      .get(`api/club_activity_history/${id}`)
      .then((res) => setActivity(res.data));
  }

  activity.sort((a, b) => {
    //주요활동내역 연도별 정렬
    if (a.year > b.year) return -1;
    if (a.year < b.year) return 1;
    return 0;
  });

  activity.sort((a, b) => {
    //주요활동내역 달별 정렬
    if (a.year === b.year) if (a.month < b.month) return -1;
    if (a.month > b.month) return 1;
    return 0;
  });

  activity.sort((a, b) => {
    //주요활동내역 내용 ㄱㄴㄷ순 정렬
    if (a.month === b.month && a.year === b.year)
      if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  function getClubProgram() {
    //활동 프로그램 데이터 가져옴
    axios.get(`api/club_programs/${id}`).then((res) => setPrograms(res.data));
  }

  useEffect(() => {
    getClubPost();
    getPromotionPost();
    getClubActivityHistory();
    getClubProgram();
  }, []);

  // 이미지 업로드 버튼 눌러서, state가 바뀌면 다시 바뀐 이미지를 불러오기
  useEffect(() => {
    getClubPost();
  }, [AddImg]);

  return (
    <>
      {AddImg == true ? <Addimg /> : null} {/* 사진 수정 창 */}
      <div className={"p-2 ml-[56px]"}>
        <div className={"flex gap-8"}>
          {/*동아리 활동*/}
          <div
            className={
              "relative w-[450px] h-[320px] 2xl:w-[637px] 2xl:h-[432px] bg-gray2 drop-shadow-md rounded-xl overflow-hidden"
            }
          >
            <div className="absolute z-10">
              <button
                className="flex items-center gap-[5px] ml-[480px] my-6 bg-[#29CCC7] text-white text-[18px] w-[120px] h-[40px] rounded-md"
                onClick={() => {
                  setAddImg(true);
                }}
              >
                <div class="material-symbols-outlined ml-[7px]">edit</div>
                <div>수정하기</div>
              </button>
            </div>
            <div>
              <img
                src={`${baseUrl}/${posts.image_urls[0]}`}
                className={"w-[637px] h-[432px] relative"}
                alt="main_image"
              ></img>
            </div>
          </div>

          <div
            className={
              "w-[450px] h-[320px] 2xl:w-[637px] 2xl:h-[432px] shadow-lg rounded-xl"
            }
          >
            <div className={"flex p-2 mt-[20px] ml-[24px] gap-3"}>
              <p className={"text-h2 font-bold "}>{posts.title}</p>
              <div className={"gap-2 flex mt-[9px]"}>
                <div
                  className={
                    "h-[20px] 2xl:h-[20px] bg-black text-h7 text-white rounded-md px-[5px]"
                  }
                >
                  {posts.tag1}
                </div>
                <div
                  className={
                    "h-[20px] 2xl:h-[20px] bg-black text-h7 text-white rounded-md px-[5px]"
                  }
                >
                  {posts.tag2}
                </div>
                <div
                  className={
                    "h-[20px] 2xl:h-[20px] bg-black text-h7 text-white rounded-md px-[5px]"
                  }
                >
                  {posts.tag3}
                </div>
              </div>
              <button className="flex items-center gap-[5px] ml-auto mr-[35px] bg-[#29CCC7] text-white text-[18px] w-[120px] h-[40px] rounded-md">
                <div class="material-symbols-outlined ml-[7px]">edit</div>
                <div>수정하기</div>
              </button>
            </div>
            <p className={"text-h3 ml-8"}>{posts.sub_content}</p>
            <p className={"text-h6 px-8 py-4 text-darkgray"}>
              {posts.main_content}
            </p>
            <div className={"grid place-content-center"}>
              <div className={"border-t mt-2 border-gray2 w-[573px] h-[120px]"}>
                <div className={"mt-[24px]"} />
                <div className={"flex gap-4"}>
                  <p className={"font-bold text-h3"}>
                    우리는 이런 활동을 해요!
                  </p>
                  <p
                    className={
                      "text-midgray list-disc list-outside text-h4 mt-[5px]"
                    }
                  >
                    가입 인원 <span className={"font-bold"}>15</span>명
                  </p>
                </div>
                <div
                  className={
                    "grid grid-cols-4 gap-[10px] text-center mt-[16px]"
                  }
                >
                  {posts.activity_tags.map((tags) => {
                    return (
                      <div
                        className={
                          "border border-sub text-sub rounded-lg h-[30px] font-bold px-[5px]"
                        }
                      >
                        {tags}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"h-[40px]"} />

        <div className={"flex gap-8"}>
          {/*동아리 프로그램*/}
          <div
            className={
              "overflow-hidden 2xl:w-[358px] 2xl:h-[512px] rounded-xl shadow-xl grid place-content-center relative"
            }
          >
            {/* <div className="bg-main from-white absolute top-0"></div> */}
            <div className="flex w-full gap-[17px]">
              <div className={"font-bold text-h2 py-6"}>동아리 프로그램</div>
              <button className="flex items-center gap-[5px] ml-auto my-6 bg-[#29CCC7] text-white text-[18px] w-[120px] h-[40px] rounded-md">
                <div class="material-symbols-outlined ml-[7px]">edit</div>
                <div>수정하기</div>
              </button>
            </div>
            <div
              className={
                "w-[294px] h-[430px] border-t border-gray2 overflow-y-scroll"
              }
            >
              {/* 동아리 프로그램 세부내용 */}
              {programs.map((program) => {
                return (
                  <div className={"my-6"}>
                    <div className={"h-[50px] my-6 flex gap-2"}>
                      <div>
                        <p className={"text-h4 text-black"}>{program.title}</p>
                        <p className={"text-h7 text-darkgray"}>
                          {program.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/*주요 활동내역 프로그램*/}
          <div
            className={
              "w-[454px] h-[512px] 2xl:w-[454px] 2xl:h-[512px] rounded-xl shadow-xl grid place-content-center"
            }
          >
            {/* 활동내역 소제목 */}
            <div className="flex w-full">
              <div className={"font-bold text-h2 py-6"}>주요 활동내역</div>
              <button className="flex items-center gap-[5px] ml-auto my-6 bg-[#29CCC7] text-white text-[18px] w-[120px] h-[40px] rounded-md">
                <div class="material-symbols-outlined ml-[7px]">edit</div>
                <div>수정하기</div>
              </button>
            </div>
            <div
              className={
                "overflow-hidden border-t border-gray2 w-[390px] h-[430px] overflow-y-scroll"
              }
            >
              {activity.map((acti) => {
                //연도 선택적으로 시각화(우회해서 작성)
                prev_length = list.length; //연도 추가전 리스트 길이 저장
                if (list.find((element) => element == acti.year) == null) {
                  //현재 데이터의 연도가 리스트에 들어와 있지 않을 때만 해당 연도를 추가함(리스트 중복 제거 코드)
                  list.push(acti.year);
                }
                after_length = list.length; //연도 추가 후 리스트 길이 저장

                return (
                  <>
                    <div className={"mt-6 flex"}>
                      {
                        prev_length != after_length ? ( //추가전 리스트 길이와 추가 후 리스트 길이가 다를 때만 연도 출력
                          <div
                            className={"w-[70px] h-auto text-[30px] font-light"}
                          >
                            {acti.year}
                          </div>
                        ) : (
                          <div
                            className={
                              "w-[70px] h-auto text-[30px] font-light text-white"
                            }
                          >
                            {acti.year}
                          </div>
                        )
                        //길이 같을 때는 너비 맞춰주기 위해 흰색으로 출력
                      }
                      <div className={"w-[320px] h-auto"}>
                        {/* 세부적인 데이터들 출력(월, 타이틀) */}

                        <ul
                          className={
                            "marker:text-main_default list-disc list-inside ml-5"
                          }
                        >
                          <div className="relative">
                            {/* list dot 주변에 길게 늘어진 선 ui */}
                            <div className="absolute ml-[2px] mt-[13px] w-[1px] h-[70px] bg-gray2 z-[-1]"></div>
                          </div>
                          <li className={"text-h4 mt-[5px]"}>
                            <span className={"text-h3 mr-6 text-gray"}>
                              {String(acti.month).padStart(2, "0")}
                            </span>
                            {acti.title}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          {/*홍보 게시판 프로그램-현재 ui만 있음 개발예정*/}
          <div
            className={
              "w-[430px] h-[512px] 2xl:w-[454px] 2xl:h-[512px] rounded-xl shadow-xl grid place-content-center"
            }
          >
            <div className="flex w-full gap-[17px]">
              <div className={"font-bold text-h2 py-6"}>홍보 게시판</div>
              <button
                className="flex items-center ml-auto my-6 bg-[#29CCC7] text-white text-[18px] w-[167px] h-[40px] rounded-md"
                onClick={() => {
                  alert("서비스 준비중입니다");
                }}
              >
                <div className="ml-[10px]">게시물 등록하기</div>
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className={"border-t border-gray2 w-[390px] h-[430px]"}>
              <div className={"h-[24px]"} />

              <div className={"text-midgray h-[340px] ml-[100px] pt-[100px]"}>
                둥록된 게시물이 없습니다.
              </div>
              <div className={"flex text-h6 ml-[140px]"}>
                <button
                  className={
                    "border w-[28px] h-[28px] text-center border-gray2 rounded"
                  }
                  onClick={() => {}}
                >
                  <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button className={"mx-2"} onClick={() => {}}>
                  <span className="font-bold">1</span> / 1
                </button>
                <button
                  className={
                    "border w-[28px] h-[28px] text-center border-gray2 rounded"
                  }
                  onClick={() => {}}
                >
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              {/* {promotions.map((promotion) => {
                  return (
                    <>
                      <div
                        className={
                          "w-[171px] h-[180px] 2xl:w-[171px] 2xl:h-[322px] rounded-xl shadow-lg transition hover:scale-110"
                        }
                        onClick={() => {
                          navigate("/promotiondetail/" + promotion._id);
                        }}
                      >
                        <img
                          src={`${baseUrl}/${promotion.image_url}`}
                          alt={"1"}
                          className={"h-[258px]"}
                        ></img>
                        <div
                          className={"h-16 text-h5 font-bold px-[10px] py-2"}
                        >
                          {promotion.title}
                        </div>
                      </div>
                    </>
                  );
                })} */}
            </div>
          </div>
        </div>
        <div className={"h-[80px]"} />
      </div>
    </>
  );
}

function Addimg() {
  //동아리 이미지 수정 모달
  const [AddImg, setAddImg] = useRecoilState(addingImgState); //이미지 추가하는 모달 창 여는 변수

  return (
    <>
      <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center z-20">
        <div className="bg-black w-full h-full opacity-50"></div>
        <div className="absolute w-[454px] h-[570px] bg-white rounded-2xl ">
          <div className="grid grid-rows-2 gap-[15px] px-[40px] py-[40px] h-[330px] ">
            <div>
              <div className="font-[700] text-[20px]">파일 첨부</div>
              <p className="text-[16px] mt-[10px]">
                000MB 이하의 이미지 파일을 업로드 가능합니다.
              </p>
            </div>
            <UploadImageForm />
          </div>
        </div>
      </div>
    </>
  );
}

const UploadImageForm = () => {
  const { id } = useParams(); // club_objid
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [AddImg, setAddImg] = useRecoilState(addingImgState); //이미지 추가하는 모달 창 여는 변수
  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(URL.createObjectURL(e.target.files[0]));
    // console.log(e.target.files[0]);
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleDelete = () => {
    setImage({ preview: "", raw: "" });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image.raw);

    if (image.raw == "") {
      Swal.fire({
        title: "올릴 이미지가 없습니다",
        text: "이미지를 업로드 해 주세요 !",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    await axios
      .post("/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log(res.data.image_url);
        axios
          .put(
            `/api/club/image/update?club_objid=${id}&image_url=${res.data.image_url}`
          )
          .then((res) => {
            setAddImg(false);
          });
      });
  };

  return (
    <div>
      <label
        className="flex flex-col justify-center text-center bg-main_mid w-[152px] h-[48px] text-white rounded-xl text-[18px] cursor-pointer"
        htmlFor={"upload-button"}
      >
        사진 파일 선택
      </label>
      <div className={"mt-[20px]"} />
      <div className="grid grid-rows-2">
        <div>
          <div className="flex">
            <div className="flex items-center gap-[15px] border border-[#E5E5E5] p-[10px] h-[150px]">
              <label htmlFor="upload-button" className={"cursor-pointer"}>
                {image.preview ? (
                  <img
                    src={image.preview}
                    alt="dummy"
                    width="140"
                    height="140"
                  />
                ) : (
                  <>
                    <span className="fa-stack fa-2x mt-3 mb-2">
                      {/*<i className="fas fa-circle fa-stack-2x" />*/}
                      <i className="fas fa-store fa-stack-1x fa-invesrse" />
                    </span>
                    <h5 className="text-center">사진을 업로드 하세요.</h5>
                  </>
                )}
              </label>
              <input
                type="file"
                id="upload-button"
                style={{ display: "none" }}
                onChange={handleChange}
                accept={"image/*"}
              />
              <div
                className="text-center flex flex-col justify-center rounded-full bg-[#C1C1C1] w-[20px] h-[20px] cursor-pointer hover:bg-red_error"
                onClick={handleDelete}
              >
                <span className="material-symbols-outlined text-white text-[10px] font-thin">
                  close
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex place-self-end gap-[10px] text-[16px]">
          <button
            className="w-[87px] h-[40px] border border-[#E5E5E5] rounded-md"
            onClick={() => {
              setAddImg(false);
            }}
          >
            취소
          </button>
          <button
            className="bg-[#29CCC7] text-white w-[87px] h-[40px] rounded-md"
            onClick={handleUpload}
          >
            업로드완료
          </button>
        </div>
      </div>
    </div>
  );
};
