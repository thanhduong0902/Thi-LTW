import { useMutation, useQuery, useQueryClient } from "react-query";
import { backBook, getListBuy } from "../Apis/Api";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import moment from "moment";
import Swal from "sweetalert2";

function BookingUser() {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const getBuy = async (data) => {
    const response = await getListBuy(data);
    return response;
  };
  const { isSuccess, isLoading, isError, data } = useQuery(`ListBuy`, () =>
    getBuy(auth.id)
  );

  const handleBackBook = useMutation(backBook);

  const handleCancel = (id) => {
    const body = {
      id: id,
    };

    Swal.fire({
      title: "Bạn có chắc muốn trả sách này?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Đồng ý",
      confirmButtonColor: "green",
      cancelButtonText: "Huỷ",
    }).then((result) => {
      if (result.isConfirmed) {
        handleBackBook.mutate(body, {
          onSuccess: (res) => {
            queryClient.invalidateQueries("ListBuy");
          },
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      {data?.data?.map((item, index) => (
        <div
          className="row p-4 bg-info bg-opacity-10 border border-info  rounded m-2"
          key={index}
        >
          <div className="col-sm-3 row ">
            <img
              height={500}
              src={item.item.linkImage}
              alt="Uploaded Image"
              className="col-sm-12 object-fit-contain"
            />
          </div>
          <div className="col-sm-4 row ms-4">
            <div
              style={{
                color: "blueviolet",
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              {item.item.title}
            </div>
            <div> Tác Giả: {item.item.author?.name} </div>
            <div>Mô tả: {item.item.des} </div>
            <div>Thể Loại: {item.item.category?.name}</div>
            <div>Số trang: {item.item.pageNumber} </div>
            <div>Số lượng muợn: {item.quantity} </div>
            <button
              className="btn btn-warning col-sm-4 ms-2"
              onClick={() => handleCancel(item.id)}
            >
              Trả sách
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default BookingUser;
