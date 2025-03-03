import { List } from "@/types/task";

export const initialLists: List[] = [
  {
    id: "1",
    title: "ToDo",
    tasks: [
      {
        id: "1",
        text: "Tạo các thành phần React tái sử dụng",
        tags: ["Ưu tiên: Trung bình", "React"],
      },
      {
        id: "2",
        text: "Tìm hiểu về React Hooks",
        tags: ["React", "Hooks"],
      },
      {
        id: "3",
        text: "Tạo khả năng kéo và thả đẹp mắt",
        tags: ["Ưu tiên: Thấp", "react-beautiful-dnd"],
      },
      {
        id: "4",
        text: "Tối ưu hóa hiệu suất ứng dụng",
        tags: ["Ưu tiên: Cao", "React", "Hiệu suất"],
      },
      {
        id: "5",
        text: "Viết tài liệu hướng dẫn cho dự án",
        tags: ["Ưu tiên: Trung bình", "Tài liệu"],
      },
      {
        id: "6",
        text: "Thêm chế độ tối (dark mode)",
        tags: ["Ưu tiên: Thấp", "UI/UX"],
      },
      {
        id: "7",
        text: "Tích hợp Redux cho quản lý trạng thái",
        tags: ["Ưu tiên: Trung bình", "Redux"],
      },
    ],
  },
  {
    id: "2",
    title: "In Progress",
    tasks: [
      {
        id: "8",
        text: "Học React cơ bản",
        tags: ["Ưu tiên: Cao", "React"],
      },
      {
        id: "9",
        text: "Viết thành phần React đầu tiên",
        tags: ["Ưu tiên: Trung bình"],
      },
      {
        id: "10",
        text: "Thiết kế giao diện người dùng",
        tags: ["Ưu tiên: Trung bình", "UI/UX"],
      },
      {
        id: "11",
        text: "Kết nối API với frontend",
        tags: ["Ưu tiên: Cao", "API", "React"],
      },
      {
        id: "12",
        text: "Kiểm tra tính năng kéo thả",
        tags: ["Ưu tiên: Trung bình", "react-beautiful-dnd"],
      },
    ],
  },
  {
    id: "3",
    title: "Done",
    tasks: [
      {
        id: "13",
        text: "Tạo ứng dụng React bằng Create React App",
        tags: ["Ưu tiên: Trung bình", "create-react-app"],
      },
      {
        id: "14",
        text: "Viết thành phần React đầu tiên",
        tags: ["Ưu tiên: Trung bình"],
      },
      {
        id: "15",
        text: "Cài đặt môi trường phát triển",
        tags: ["Ưu tiên: Cao", "Setup"],
      },
      {
        id: "16",
        text: "Hoàn thành khóa học JavaScript cơ bản",
        tags: ["Ưu tiên: Thấp", "JavaScript"],
      },
      {
        id: "17",
        text: "Sửa lỗi giao diện trên mobile",
        tags: ["Ưu tiên: Trung bình", "Responsive"],
      },
      {
        id: "18",
        text: "Đánh giá hiệu suất ứng dụng",
        tags: ["Ưu tiên: Cao", "Hiệu suất"],
      },
    ],
  },
];