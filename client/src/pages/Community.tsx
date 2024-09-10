/**
 * File Name    : Header.tsx
 * Description  : layout - 헤더 -
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김우현      Created     커뮤니티 페이지 생성
 */
import React from 'react';
import { Link } from 'react-router-dom';



const Community: React.FC = () => {
  return (
    <div className='community-titles flex w-[1920px] flex-col items-center'>
      <div className='mt-[140px]'>
        <div className='text-[28px] font-bold'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[8D8B67]'></div>
      </div>
      <div className='mt-[55px]'>
        <div className='flex items-center'>
          <div className='flex cursor-pointer gap-[80px] text-[20px]'>
            <div>전체</div>
            <div>#면접</div>
            <div>#모임</div>
            <div>#스터디</div>
            <div>#잡답</div>
          </div>
          <div className='ml-[70px] flex items-center'>
            <div className='flex items-center gap-[20px]'>
              <input className='flex h-[50px] w-[300px] rounded-xl border p-[10px]' placeholder='제목/내용을 입력해주세요' />
              <button className='h-[50px] w-[80px] rounded-[10px] bg-[#909700] font-bold text-white'>검색</button>
            </div>
          </div>
        </div>
      </div>

      <div className='community-post mt-[60px]'>
        <div className='flex w-[700px] justify-between'>
          <div>
            <Link to='/CommunityWrite'>
              <button className='h-[46px] w-[180px] rounded-[10px] bg-[#909700] text-[20px] font-bold text-white'>게시글 작성</button>
            </Link>
          </div>
          <div className='flex items-center gap-[10px] text-[18px]'>
            <button className='text-[#59573D]'>최신순</button>
            <div className=''>|</div>
            <button className='text-[#AEAC9A]'>인기순</button>
            <div className=''>|</div>
            <button className='text-[#AEAC9A]'>조회순</button>
          </div>
        </div>

        <div className='w-[700px]'>
          <div className='mb-[30px] flex flex-col'>
            <div className='mt-[10px] w-full border-b-2 border-[8D8B67]'></div>
            <div className='mt-[30px]'>
              <div className='flex w-full items-center gap-[70px]'>
                <div className='h-[35px] w-[85px] cursor-pointer bg-[#FFC5C3] text-center text-[20px]'>#스터디</div>
                <div className='text-[20px]'>1:1 대화방 및 스터디 구합니다</div>
              </div>
              <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
                <img src='/clover-image.png' alt='cloverImg' />
                <div>똑순이 권위자</div>
              </div>
              <div className='flex justify-end text-[20px]'>
                <div className='flex'>
                  <div className='text-[#AEAC9A]'>
                    조회수 <span className='text-[#A1DFFF]'>50</span>
                  </div>
                  <div className='ml-[30px] text-[#AEAC9A]'>
                    좋아요 <span className='text-[#FFC5C3]'>100</span>
                  </div>
                  <div className='ml-[175px] text-[#AEAC9A]'>작성일 2024-09-06</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
                </div>
              </div>
            </div>

            <div className='mt-[30px]'>
              <div className='flex w-full items-center gap-[70px]'>
                <div className='h-[35px] w-[85px] cursor-pointer bg-[#FFC5C3] text-center text-[20px]'>#스터디</div>
                <div className='text-[20px]'>1:1 대화방 및 스터디 구합니다</div>
              </div>
              <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
                <img src='/clover-image.png' alt='cloverImg' />
                <div>똑순이 권위자</div>
              </div>
              <div className='flex justify-end text-[20px]'>
                <div className='flex'>
                  <div className='text-[#AEAC9A]'>
                    조회수 <span className='text-[#A1DFFF]'>50</span>
                  </div>
                  <div className='ml-[30px] text-[#AEAC9A]'>
                    좋아요 <span className='text-[#FFC5C3]'>100</span>
                  </div>
                  <div className='ml-[175px] text-[#AEAC9A]'>작성일 2024-09-06</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
                </div>
              </div>
            </div>

            <div className='mt-[30px]'>
              <div className='flex w-full items-center gap-[70px]'>
                <div className='h-[35px] w-[85px] cursor-pointer bg-[#FFC5C3] text-center text-[20px]'>#스터디</div>
                <div className='text-[20px]'>1:1 대화방 및 스터디 구합니다</div>
              </div>
              <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
                <img src='/clover-image.png' alt='cloverImg' />
                <div>똑순이 권위자</div>
              </div>
              <div className='flex justify-end text-[20px]'>
                <div className='flex'>
                  <div className='text-[#AEAC9A]'>
                    조회수 <span className='text-[#A1DFFF]'>50</span>
                  </div>
                  <div className='ml-[30px] text-[#AEAC9A]'>
                    좋아요 <span className='text-[#FFC5C3]'>100</span>
                  </div>
                  <div className='ml-[175px] text-[#AEAC9A]'>작성일 2024-09-06</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
                </div>
              </div>
            </div>

            <div className='mt-[30px]'>
              <div className='flex w-full items-center gap-[70px]'>
                <div className='h-[35px] w-[85px] cursor-pointer bg-[#FFC5C3] text-center text-[20px]'>#스터디</div>
                <div className='text-[20px]'>1:1 대화방 및 스터디 구합니다</div>
              </div>
              <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
                <img src='/clover-image.png' alt='cloverImg' />
                <div>똑순이 권위자</div>
              </div>
              <div className='flex justify-end text-[20px]'>
                <div className='flex'>
                  <div className='text-[#AEAC9A]'>
                    조회수 <span className='text-[#A1DFFF]'>50</span>
                  </div>
                  <div className='ml-[30px] text-[#AEAC9A]'>
                    좋아요 <span className='text-[#FFC5C3]'>100</span>
                  </div>
                  <div className='ml-[175px] text-[#AEAC9A]'>작성일 2024-09-06</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
                </div>
              </div>
            </div>

            <div className='mt-[30px]'>
              <div className='flex w-full items-center gap-[70px]'>
                <div className='h-[35px] w-[85px] cursor-pointer bg-[#FFC5C3] text-center text-[20px]'>#스터디</div>
                <div className='text-[20px]'>1:1 대화방 및 스터디 구합니다</div>
              </div>
              <div className='mb-[5px] flex items-center justify-end gap-[5px]'>
                <img src='/clover-image.png' alt='cloverImg' />
                <div>똑순이 권위자</div>
              </div>
              <div className='flex justify-end text-[20px]'>
                <div className='flex'>
                  <div className='text-[#AEAC9A]'>
                    조회수 <span className='text-[#A1DFFF]'>50</span>
                  </div>
                  <div className='ml-[30px] text-[#AEAC9A]'>
                    좋아요 <span className='text-[#FFC5C3]'>100</span>
                  </div>
                  <div className='ml-[175px] text-[#AEAC9A]'>작성일 2024-09-06</div> {/*175px은 아래위 정렬 1:1대화방 때문에 진행함*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
