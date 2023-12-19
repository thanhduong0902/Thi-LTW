import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { deleteBook, getListItem } from "../Apis/Api";
import Swal from "sweetalert2";
import moment from "moment";
import AuthContext from "../context/AuthProvider";

function HomeView() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getItem = async () => {
    return getListItem();
  };

  const listItem = useQuery("listItem", getItem, {
    enabled: false,
  });

  useEffect(() => {
    listItem.refetch();
  }, []);

  const handleDeleteBook = useMutation(deleteBook);

  function handleDelete(idbook) {
    const body = {
      id: idbook,
    };
    Swal.fire({
      title: "Bạn có thực sự muốn xóa sách này?",
      showCancelButton: true,
      confirmButtonText: "Có",
      denyButtonText: `Hủy`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        handleDeleteBook.mutate(body, {
          onSuccess: (res) => {
            listItem.refetch();
          },
        });
      }
    });
  }
  // if (isLoading) {
  //   return (
  //     <div class="d-flex justify-content-center">
  //       <div class="spinner-border" role="status">
  //         <span class="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="text-center p-4">
      <h2 className="text-center">Chào mừng Quản lí</h2>
      <div className="row ">
        <button
          className="btn btn-warning "
          onClick={() => {
            navigate(`/BookViewAdmin/-1`);
          }}
        >
          Thêm sách
        </button>
      </div>
      <div className="row ">
        <table className="table table-striped table-bordered">
          <thead className="table-warning">
            <tr>
              <td>Số thứ tự</td>
              <td>Tiêu đề</td>
              <td>Tác giả</td>
              <td>Thể loại</td>
              <td>Số trang</td>
              {/* <td>Số lượng đã bán</td> */}
              <td>Hoạt động</td>
            </tr>
          </thead>
          <tbody>
            {listItem ? (
              listItem?.data?.data.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.category.name}</td>
                  {/* <td>{moment(book.date).format("DD-MM-YYYY")}</td> */}
                  <td>{book.pageNumber}</td>
                  {/* <td>{book.soldNumber}</td> */}

                  <td>
                    <Link to={`/BookViewAdmin/${book.id}`}>
                      <button className="btn btn-success" style={{}}>
                        Xem
                      </button>
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        handleDelete(book.id);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div />
            )}
          </tbody>
        </table>
      </div>

      <button
        className="rounded w-25 mt-2"
        onClick={() => {
          setAuth("");
          localStorage.clear();
          navigate("/");
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
export default HomeView;
