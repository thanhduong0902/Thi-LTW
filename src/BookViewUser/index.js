import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { buyBook, getDetailBook, getListCmt, postCmt } from "../Apis/Api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BsStarFill } from "react-icons/bs";
import Swal from "sweetalert2";
import "./BookViewUser.css";
import AuthContext from "../context/AuthProvider";
import moment from "moment";

function BookViewUser() {
  const [book, setBook] = useState({});
  const queryClien = useQueryClient();
  const profile = useContext(AuthContext);
  const pagaram = useParams();
  const bookid = pagaram.bookid;
  const [numberItem, setNumberItem] = useState(0);
  const [rating, setRating] = useState(0);
  const [showGetCMT, setShowGetCMT] = useState(false);
  const [checkCMT, setCheckCMT] = useState(false);
  const [cmt, setCmt] = useState("");

  const [showFullCmt, setShowFullCmt] = useState(false);
  const [bookingTickets, setBookingTickets] = useState([]);
  const [star, setStar] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarHover = (index) => {
    setRating(index + 1);
  };

  const handleStarLeave = () => {
    setRating(hoveredRating);
    setRating(0);
  };

  const getCmt = async () => {
    const response = await getListCmt(bookid);
    return response;
  };

  const handleBuyBook = useMutation(buyBook);

  const addCmt = useMutation(postCmt);

  function handleOnCLickOk() {
    const body = {
      vote: star,
      user_id: profile.auth.id,
      book_id: bookid,
      comment: cmt,
      username: profile.auth.username,
    };

    addCmt.mutate(body, {
      onSuccess: (response) => {
        if (response) {
          setCmt("");
          setRating(0);
          queryClien.invalidateQueries(`ListCmtDetail${bookid}`);
        }
      },
    });
  }

  const listCmt = useQuery(`ListCmtDetail${bookid}`, getCmt);

  useEffect(() => {
    const fetchData = async () => {
      await listCmt.refetch();
    };
    fetchData();
  }, []);

  const { isSuccess, isLoading, isError, data } = useQuery(
    `detailBook${bookid}`,
    () => getDetailBook(bookid)
  );

  if (isLoading || listCmt.isLoading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function handleOnclickCancel() {
    setShowGetCMT(false);
    setCmt("");
  }
  function handleOnClickMuaNgay() {
    const body = {
      userId: profile.auth.id,
      bookId: bookid,
      quantity: numberItem,
    };

    if (numberItem <= 0) {
      Swal.fire({
        icon: "info",
        title: "Bạn chưa nhập số lượng",
      });
    } else {
      Swal.fire({
        icon: "question",
        title: "Bạn có chắc muốn đặt mua cuốn sách này?",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "green",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          handleBuyBook.mutate(body, {
            onSuccess: (res) => {
              Swal.fire("Thành công!", "OK!", "success");
              setNumberItem(0);
            },
          });
        }
      });
    }
  }

  return (
    <div className="row p-4">
      <div className="col-sm-3 row ">
        <img
          height={500}
          src={data.data.results.img}
          alt="Uploaded Image"
          className="col-sm-12 object-fit-contain"
        />
      </div>
      <div className="col-sm-6 row">
        <div
          style={{
            color: "blueviolet",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {data.data.results.title}
        </div>
        <div> Tác Giả: {data.data.results.author}</div>
        <div>Thể Loại: {data.data.results.type}</div>
        <div>
          Ngày phát hành: {moment(data.data.results.date).format("DD-MM-YYYY")}
        </div>
        <div>Đã Bán: {data.data.results.soldNumber}</div>
        <div>Mô tả: {data.data.results.description}</div>
        <div className="col-sm-6 row align-items-center ">
          <button
            title="-"
            style={{ height: 40 }}
            className="btn btn-warning col-sm-1 justify-content-center"
            disabled={numberItem === 0 ? true : false}
            onClick={() => setNumberItem(numberItem - 1)}
          >
            -
          </button>
          <div className="col-sm-1">{numberItem}</div>
          <button
            style={{ height: 40 }}
            className="btn btn-warning col-sm-1 justify-content-center "
            onClick={() => setNumberItem(numberItem + 1)}
          >
            +
          </button>
        </div>

        <button
          className="btn btn-warning "
          onClick={() => handleOnClickMuaNgay()}
        >
          Mua Ngay
        </button>
      </div>

      <div className="col-sm-6 row text-center">
        <p className="col-sm-12 ">
          {listCmt.data.data.results.length > 0
            ? listCmt.data.data.results.length
            : "Chưa có"}
          {" bình luận"}
          <span style={{ color: "gold" }}>&#9733;</span>{" "}
        </p>
      </div>

      <div className="col-sm-12 row ">
        {showFullCmt &&
          listCmt.data.data.results.map((item, index) => {
            return (
              <div
                key={index}
                className=" p-3 bg-info bg-opacity-10 border border-info rounded m-2"
              >
                <div style={{ color: "blueviolet", fontWeight: "bold" }}>
                  {item.username}{" "}
                </div>
                <div>{item.comment}</div>
                <p className="col-sm-12 ">
                  Đánh giá:{" "}
                  {[...Array(item.vote)].map((_, index) => (
                    <BsStarFill color="gold" size={24} />
                  ))}{" "}
                </p>
              </div>
            );
          })}

        <div
          onClick={() => setShowFullCmt(showFullCmt ? false : true)}
          className="showmore"
        >
          {showFullCmt ? "Thu gọn" : "Hiện bình luận"}
        </div>

        {showGetCMT ? (
          <div>
            <div onMouseLeave={star !== rating ? handleStarLeave : () => {}}>
              <p>
                Đánh giá:{"  "}
                {[...Array(5)].map((_, index) => (
                  <BsStarFill
                    style={{ display: "inline-block" }}
                    key={index + 1}
                    onClick={() => setStar(index + 1)}
                    onMouseEnter={() => handleStarHover(index)}
                    color={index < rating ? "gold" : "gray"}
                    size={24}
                  />
                ))}
              </p>
            </div>
            <div class="input-group mb-3">
              <input
                type="text"
                className="form-control m-2 rounded"
                placeholder="Thêm bình luận.."
                value={cmt}
                onChange={(e) => setCmt(e.target.value)}
              />
              <button
                class="btn btn-primary m-2 rounded"
                type="button"
                onClick={() => handleOnCLickOk()}
              >
                OK
              </button>
              <button
                class="btn btn-danger m-2 rounded"
                type="button"
                onClick={() => handleOnclickCancel()}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div onClick={() => setShowGetCMT(true)} className="showmore">
            {" "}
            Thêm đánh giá
          </div>
        )}
      </div>
    </div>
  );
}
export default BookViewUser;
