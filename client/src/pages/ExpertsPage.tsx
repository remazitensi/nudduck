import axios from "axios";
import { useEffect, useState } from "react";

interface ExpertCardProps {
  expert: Record<string, any>;
  setOpen: (val: boolean) => void;
  setSelectedExpert: (val: Record<string, any>) => void;
}

const ExpertCard = ({
  expert,
  setOpen,
  setSelectedExpert,
}: ExpertCardProps) => {
  const fetchExpertDetails = async (id: string) => {
    if (!id) {
      console.error("ID가 필요합니다.");
      return;
    }
    try {
      const response = await axios.get(`api/expert/${id}`);
      return response.data;
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error.message);
    }
  };

  const openModal = async (expert: Record<string, any>) => {
    const details = await fetchExpertDetails(expert.id);
    setSelectedExpert(details);
    setOpen(true);
  };

  return (
    <div
      key={expert.id}
      className="flex flex-col w-[220px] justify-center items-center bg-gray-100 m-[10px] rounded-lg"
      style = {{ backgroundColor: '#FAFAFA' }}
    >
      <img
        src={expert.profile_image}
        alt={`${expert.name} 프로필`}
        className="w-[100px] h-[100px] mt-[25px] rounded-lg"
      />
      <p className="text-sm font-medium text-gray-600 mt-[15px]">상담사</p>
      <p className="text-lg font-semibold text-gray-900">{expert.name}</p>
      <p className="text-sm text-gray-500 mt-[10px]">
        {expert.hashtags.map((tag: string, index: number) => (
          <span key={index}>
            #{tag}
            {index < expert.hashtags.length - 1 && " "}
          </span>
        ))}
      </p>
      <button
        onClick={() => openModal(expert)}
        className="mt-[20px] mb-[20px] rounded-md"
        style={{backgroundColor: '#C7C4A7'}}
      >
        자세히
      </button>
    </div>
  );
};

export const ExpertsPage = () => {
  const [experts, setExperts] = useState<any[] | null>([
    {
      id: 1,
      name: "홍길동",
      profile_image: "https://via.placeholder.com/100",
      hashtags: ["경험", "전문성"],
      age: 35,
      email: "hong@expert.com",
      phone: "010-1234-5678",
      cost: "50,000원",
      bio: "경험이 풍부한 전문가입니다.",
    },
    {
      id: 2,
      name: "김철수",
      profile_image: "https://via.placeholder.com/100",
      hashtags: ["성실", "열정"],
      age: 40,
      email: "kim@expert.com",
      phone: "010-9876-5432",
      cost: "70,000원",
      bio: "성실하고 열정이 넘치는 전문가입니다.",
    },
    {
      id: 3,
      name: "김철수",
      profile_image: "https://via.placeholder.com/100",
      hashtags: ["성실", "열정"],
      age: 40,
      email: "kim@expert.com",
      phone: "010-9876-5432",
      cost: "70,000원",
      bio: "성실하고 열정이 넘치는 전문가입니다.",
    },
    {
      id: 4,
      name: "김철수",
      profile_image: "https://via.placeholder.com/100",
      hashtags: ["성실", "열정"],
      age: 40,
      email: "kim@expert.com",
      phone: "010-9876-5432",
      cost: "70,000원",
      bio: "성실하고 열정이 넘치는 전문가입니다.",
    },
    {
      id: 5,
      name: "김철수",
      profile_image: "https://via.placeholder.com/100",
      hashtags: ["성실", "열정"],
      age: 40,
      email: "kim@expert.com",
      phone: "010-9876-5432",
      cost: "70,000원",
      bio: "성실하고 열정이 넘치는 전문가입니다.",
    },
    {
      id: 6,
      name: "김철수",
      profile_image: "https://via.placeholder.com/100",
      hashtags: ["성실", "열정"],
      age: 40,
      email: "kim@expert.com",
      phone: "010-9876-5432",
      cost: "70,000원",
      bio: "성실하고 열정이 넘치는 전문가입니다.",
    },
  ]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Record<
    string,
    any
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const closeModal = () => {
    setOpen(false);
    setSelectedExpert(null);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("modal")) return;
    closeModal();
  };

  const fetchExpertList = async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    try {
      setLoading(true);
      const response = await axios.get("api/expert", {
        params: {
          page: page,
          limit: limit,
        },
      });
      const data = response.data;
      setExperts(data.experts);
      setTotalCount(data.totalCount);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertList({ page, limit });
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  let totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="w-[1920px]">
      <div className="w-[1200px] flex flex-wrap">
        {experts?.map((expert: any) => (
          <ExpertCard
            key={expert.id}
            expert={expert}
            setOpen={setOpen}
            setSelectedExpert={setSelectedExpert}
          />
        ))}
      </div>
      {open && selectedExpert && (
        <div
          className="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleBackgroundClick}
        >
          <div className="modal-content relative mx-auto w-[60%] rounded-lg bg-white p-6 justify-start">
            <div className="flex flex-col bg-gray-100 w-[220px] m-[20px] rounded-lg" style={{backgroundColor: '#FAFAFA'}}>
              <img
                src={selectedExpert.profile_image}
                alt={`${selectedExpert.name} 프로필`}
                className="profile-image w-[100px] h-[100px] mt-[25px] rounded-lg"
              />
              <p className="text-sm font-medium text-gray-600 mt-[15px]">
                상담사
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedExpert.name}
              </p>
              <p className="text-sm text-gray-500 mt-[10px]">
                {selectedExpert.hashtags.map((tag: string, index: number) => (
                  <span key={index}>
                    #{tag}
                    {index < selectedExpert.hashtags.length - 1 && " "}
                  </span>
                ))}
              </p>
              <button className="mt-[20px] mb-[20px] rounded-sm" style={{backgroundColor:'#C7C4A7'}}>
                1:1 상담하기
              </button>
            </div>
            <div className="expert-details flex flex-col w-[660px] h-[330px]" style={{backgroundColor: '#FBFAEC'}}>
              <p>이름: {selectedExpert.name}</p>
              <p>나이: {selectedExpert.age}</p>
              <p>이메일: {selectedExpert.email}</p>
              <p>연락처: {selectedExpert.phone}</p>
              <p>가격: {selectedExpert.cost}</p>
              <br />
              <p>{selectedExpert.bio}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pagination-controls mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={index + 1 === page}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
