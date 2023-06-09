import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Navbar, Nav, Form, FormControl } from "react-bootstrap";
import "./homeViewUser.css";
import AuthContext from "../context/AuthProvider";
import { getListBook } from "../Apis/Api";
import { useQuery } from "react-query";
import moment from "moment";
function HomeViewUser() {
  const profile = useContext(AuthContext);
  const navigate = useNavigate();
  const getList = async () => {
    const response = await getListBook();
    return response;
  };
  const listBook = useQuery("ListBook", getList);

  useEffect(() => {
    listBook.refetch();
  }, []);

  if (listBook.isLoading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div>
        <Navbar bg="light" expand="sm">
          <p style={{ color: "blueviolet", margin: 10 }}>
            Xin chào {profile.auth.username}
          </p>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="mr-auto"
              style={{ marginLeft: "auto", display: "flex" }}
            >
              <Nav.Link href="/HomeViewUSer"> Trang chủ</Nav.Link>
              <Nav.Link href="/BookingUser">Sách đã đặt mua</Nav.Link>
              <Nav.Link
                href="/"
                onClick={() => {
                  localStorage.clear();
                  profile.setAuth("");
                }}
              >
                Đăng xuất
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <h2 className="text-center" style={{ color: "blueviolet" }}>
        Thư viện Hồi Ức
      </h2>
      <div className="row">
        {listBook.data.data.results.map((book, index) => (
          <div
            onClick={() => {
              navigate(`/BookViewUser/${book.id}`);
            }}
            key={index}
            className="card item"
            style={{ width: "20rem", margin: 20 }}
          >
            <img
              src={book.img}
              className="card-img-top object-fit-fill rounded"
              alt="..."
              style={{ width: "100%", height: 400 }}
            />
            <div className="card-body">
              <h5 className="card-title">{book.title}</h5>
              <p className="card-text">{book.description}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Tác giả : {book.author}</li>
              <li className="list-group-item">
                Ngày xuất bản : {moment(book.date).format("DD-MM-YYYY")}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeViewUser;
