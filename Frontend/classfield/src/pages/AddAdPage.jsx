import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Button, Card, Typography, message, Upload } from "antd";
import { PlusOutlined, TagOutlined, UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AddAdPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Функція для правильної обробки файлу в Ant Design Form
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    // Створюємо об'єкт FormData, бо ми відправляємо файл (фото), а не просто текст
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    
    // Якщо користувач додав фото, беремо його оригінальний файл
    if (values.photo && values.photo.length > 0) {
      formData.append("photo", values.photo[0].originFileObj);
    }

    try {
      // Відправляємо formData. Axios автоматично встановить потрібний Content-Type для файлів
      await axiosInstance.post("classfields/", formData);
      message.success("Оголошення з фото успішно додано!");
      navigate("/my-ads");
    } catch (error) {
      console.error("Помилка:", error);
      // Показуємо детальну помилку від сервера, якщо вона є (наприклад, файл завеликий)
      const errorMsg = error.response?.data?.photo 
        ? error.response.data.photo[0] 
        : "Помилка при створенні оголошення. Перевірте дані.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
      <Card
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "none",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div 
            style={{ 
              background: "#e6f7ff", 
              width: "64px", 
              height: "64px", 
              borderRadius: "50%", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              margin: "0 auto 16px" 
            }}
          >
            <PlusOutlined style={{ fontSize: "28px", color: "#1890ff" }} />
          </div>
          <Title level={2} style={{ margin: 0 }}>Створити оголошення</Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>Заповніть деталі вашого товару</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Назва товару</span>}
            name="title"
            rules={[{ required: true, message: "Будь ласка, введіть назву!" }]}
          >
            <Input 
              placeholder="Наприклад: Ноутбук Apple MacBook Air" 
              prefix={<TagOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Ціна</span>}
            name="price"
            rules={[
              { required: true, message: "Вкажіть ціну!" },
              { type: "number", max: 999999, message: "Ціна не може перевищувати 999 999" },
              { type: "number", min: 0, message: "Ціна не може бути від'ємною" }
            ]}
          >
            <InputNumber 
              placeholder="0" 
              style={{ width: "100%" }} 
              addonAfter="₴"
            />
          </Form.Item>

          {/* НОВЕ ПОЛЕ ДЛЯ ФОТО */}
          <Form.Item
            name="photo"
            label={<span style={{ fontWeight: 500 }}>Фотографія товару</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Підтримуються формати JPG, PNG, WEBP. Розмір до 10 МБ."
          >
            <Upload
              name="photo"
              listType="picture" // Показує мініатюру завантаженого фото
              maxCount={1}       // Дозволяємо лише 1 фото
              beforeUpload={() => false} // Зупиняє автоматичне відправлення (ми відправимо разом з формою)
              accept="image/png, image/jpeg, image/webp"
            >
              <Button icon={<UploadOutlined />}>Оберіть фото</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Опис</span>}
            name="description"
            rules={[{ required: true, message: "Додайте опис товару!" }]}
          >
            <TextArea
              placeholder="Детально опишіть ваш товар, його стан та характеристики..."
              rows={5}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "40px", marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                background: "#03498b", 
                height: "50px", 
                fontSize: "16px", 
                borderRadius: "8px",
                fontWeight: 500
              }}
            >
              Опублікувати оголошення
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdPage;