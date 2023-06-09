import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addBook, editBook, getDetailBook, uploadFile } from "../Apis/Api";
import moment from "moment";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebaseConfig";
import Swal from "sweetalert2";
function BookViewAdmin() {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const bookid = params.bookid;
  const [buttonEAS, setButtonEAS] = useState(bookid < 0 ? "Add" : "Edit");
  const updateBook = useMutation(editBook);
  const genreOption = [
    { value: "Chính trị - pháp luật", label: "Chính trị - pháp luật" },
    {
      value: "Khoa học công nghệ - Kinh tế",
      label: "Khoa học công nghệ - Kinh tế",
    },
    { value: "Văn hóa xã hội - Lịch sử", label: "Văn hóa xã hội - Lịch sử" },
    { value: "Giáo trình", label: "Giáo trình" },
    { value: "Truyện, tiểu thuyết", label: "Truyện, tiểu thuyết" },
    {
      value: "Tâm lý, tâm linh, tôn giáo",
      label: "Tâm lý, tâm linh, tôn giáo",
    },
    { value: "Thiếu nhi", label: "Thiếu nhi" },
    { value: "Văn học nghệ thuật", label: "Văn học nghệ thuật" },
  ];

  const [book, setBook] = useState({});

  const { isSuccess, isLoading, isError, data } = useQuery(
    `detailBook${bookid}`,
    () => getDetailBook(bookid)
  );

  const [selectedOption, setSelectedOption] = useState("");
  useEffect(() => {
    if (isSuccess && data && bookid > 0) {
      setBook(data.data.results);
      setSelectedOption({
        value: data.data.results.type,
        label: data.data.results.type,
      });
    }
  }, [isSuccess, data]);

  const handleFileChange = async (event) => {
    setLoading(true);
    const imageFile = event.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        setTimeout(() => {
          setLoading(false);
        }, 4000);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          setLoading(false);
        });
      }
    );
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    setBook({ ...book, type: option.value });
  };

  const handleOnclickButtonEAS = () => {
    if (buttonEAS === "Save") {
      const body = {
        title: book.title,
        author: book.author,
        description: book.description,
        date: moment(book.date).format("YYYY-MM-DD"),
        pageNumber: book.pageNumber,
        type: selectedOption.value,
        img: imgUrl,
        id: bookid,
      };

      updateBook.mutate(body, {
        onSuccess: (res) => {
          console.log(res);
          queryClient.invalidateQueries("listBook");
          queryClient.invalidateQueries(`detailBook${bookid}`);
          setBook("");
          navigate("/HomeView");
        },
      });
    }
    setButtonEAS("Save");
  };
  const addNewBook = useMutation(addBook);

  const handleOnClickAdd = () => {
    const body = {
      title: book.title,
      author: book.author,
      description: book.description,
      date: moment(book.date).format("YYYY-MM-DD"),
      pageNumber: book.pageNumber,
      type: selectedOption.value,
      img: imgUrl,
    };
    Swal.fire({
      title: "Bạn có chắc muốn thêm sách ?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Đồng ý",
      confirmButtonColor: "green",
      cancelButtonText: "Huỷ",
    }).then((result) => {
      if (result.isConfirmed) {
        addNewBook.mutate(body, {
          onSuccess: (res) => {
            if (res.data.results.message) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.data.results.message,
              });
            } else {
              queryClient.invalidateQueries("listBook");
              setBook("");
              navigate("/HomeView");
            }
          },
        });
      }
    });
  };

  const handleSubmmit = (e) => {
    e.preventDefault();

    if (bookid > 0) handleOnclickButtonEAS();
    else handleOnClickAdd();
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
    <form
      className="row bg-info bg-opacity-50  m-4 rounded border border-info"
      onSubmit={handleSubmmit}
    >
      <div className="col-sm-6 row">
        <div className="col-sm-6 row me-2">
          <div className="col-sm-12">Tiêu đề :</div>
          <input
            required
            type="text"
            className="col-sm-12 form-control "
            value={book?.title}
            disabled={buttonEAS === "Edit"}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
          ></input>
        </div>
        <div className="col-sm-6 row ">
          <div className="col-sm-12">Tác giả:</div>
          <input
            required
            type="text"
            className="col-sm-12 form-control"
            value={book?.author}
            disabled={buttonEAS === "Edit"}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
          ></input>
        </div>

        <div className="col-sm-10 mt-4 ">Mô tả:</div>
        <textarea
          disabled={buttonEAS === "Edit"}
          type="text"
          className="col-sm-10 form-control "
          value={book?.description}
          rows={6}
          onChange={(e) => setBook({ ...book, description: e.target.value })}
        ></textarea>

        <div className="col-sm-6 row me-2 mt-2">
          <div className="col-sm-12 ">Ngày phát hành:</div>
          <input
            required
            type="date"
            className="col-sm-12 form-control"
            value={book?.date ? moment(book?.date).format("YYYY-MM-DD") : ""}
            disabled={buttonEAS === "Edit"}
            onChange={(e) => setBook({ ...book, date: e.target.value })}
          ></input>
        </div>

        <div className="col-sm-6 row mt-2">
          <div className="col-sm-12">Số trang:</div>
          <input
            type="text"
            className="col-sm-12 form-control "
            value={book?.pageNumber}
            disabled={buttonEAS === "Edit"}
            onChange={(e) => setBook({ ...book, pageNumber: e.target.value })}
          ></input>
        </div>
        {bookid > 0 && (
          <div className="col-sm-6 row me-2 mt-2">
            <div className="col-sm-12">Số sách đã bán:</div>
            <input
              type="text"
              className="col-sm-12 form-control "
              value={book?.soldNumber}
              disabled={buttonEAS === "Save"}
              onChange={(e) => setBook({ ...book, soldNumber: e.target.value })}
            ></input>
          </div>
        )}

        <div className="col-sm-6 row">
          <div className="col-sm-12 mt-2">Thể loại:</div>
          <Select
            isDisabled={buttonEAS === "Edit"}
            className="col-sm-12"
            options={genreOption}
            value={selectedOption}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="col-sm-6 row ">
        <input
          disabled={buttonEAS === "Edit"}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className=" col-sm-3 d-flex justify-content-around rounded"
          onClick={handleUploadClick}
        >
          Tải ảnh lên
        </button>
        {loading ? (
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <img
            src={imgUrl ? imgUrl : book.img}
            className="object-fit-contain rounded"
            height="500"
          />
        )}
      </div>

      <div className="d-flex justify-content-around my-4">
        <div></div>
        <div></div>
        {bookid < 0 ? (
          <button className="p-2 btn btn-secondary">Thêm</button>
        ) : (
          <button className="btn btn-secondary">{buttonEAS}</button>
        )}
      </div>
    </form>
  );
}
export default BookViewAdmin;
