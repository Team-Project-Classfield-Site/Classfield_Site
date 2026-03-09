import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, InputNumber, Button, Card, Typography, message, Upload } from "antd";
import { EditOutlined, TagOutlined, UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const EditAdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axiosInstance.get(`classfields/${id}/`);
        const ad = response.data;
        
        form.setFieldsValue({
          title: ad.title,
          price: ad.price,
          description: ad.description,
        });
      } catch (error) {
        message.error("Не вдалося завантажити оголошення");
        navigate("/my-ads");
      } finally {
        setFetching(false);
      }
    };
    fetchAd();
  }, [id, form, navigate]);

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    
   
    if (values.photo && values.photo.length > 0) {
      formData.append("photo", values.photo[0].originFileObj);
    }

    try {
      await axiosInstance.patch(`classfields/${id}/`, formData);
      message.success("Оголошення успішно оновлено!");
      navigate("/my-ads");
    } catch (error) {
      console.error("Помилка:", error);
      message.error("Помилка при оновленні. Перевірте дані.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Завантаження даних...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "0px 20px" }}>
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
              background: "#fff7e6", 
              width: "64px", 
              height: "64px", 
              borderRadius: "50%", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              margin: "0 auto 16px" 
            }}
          >
            <EditOutlined style={{ fontSize: "28px", color: "#fa8c16" }} />
          </div>
          <Title level={2} style={{ margin: 0 }}>Редагувати оголошення</Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>Внесіть необхідні зміни</Text>
        </div>

        <Form
          form={form}
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
            <Input prefix={<TagOutlined style={{ color: "#bfbfbf" }} />} />
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
            <InputNumber style={{ width: "100%" }} addonAfter="₴" />
          </Form.Item>

          <Form.Item
            name="photo"
            label={<span style={{ fontWeight: 500 }}>Нове фото (залишіть порожнім, щоб не змінювати)</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="photo"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/png, image/jpeg, image/webp"
            >
              <Button icon={<UploadOutlined />}>Оновити фото</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Опис</span>}
            name="description"
            rules={[{ required: true, message: "Додайте опис товару!" }]}
          >
            <TextArea rows={5} style={{ resize: "none" }} />
          </Form.Item>

          <Form.Item style={{ marginTop: "40px", marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                background: "#fa8c16", 
                borderColor: "#fa8c16",
                height: "50px", 
                fontSize: "16px", 
                borderRadius: "8px",
                fontWeight: 500
              }}
            >
              Зберегти зміни
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditAdPage;