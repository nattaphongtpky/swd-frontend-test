"use client";

import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  setPeople,
  addPerson,
  updatePerson,
  deletePerson,
  Person,
} from "@/lib/features/peopleSlice";
import { updateField, resetForm, setEditMode } from "@/lib/features/formSlice";
import {
  Table,
  Button,
  Input,
  Form,
  Select,
  Space,
  Popconfirm,
  Card,
  Typography,
  Radio,
  InputNumber,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import { rename } from "fs";
import { render } from "sass";
import CitizenIdInput from "@/components/CitizenIdInput";
import Link from "next/link";

// const { Title } = Typography;
const { Option } = Select;
interface Props {
  params: {
    locale: string;
  };
}

export default function Home({ params: { locale } }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people.list);
  const formData = useSelector((state: RootState) => state.personForm);

  const [isLoaded, setIsLoaded] = useState(false);

  const { t } = useTranslation("translation");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("peopleData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          dispatch(setPeople(parsedData));
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      }
      setIsLoaded(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("peopleData", JSON.stringify(people));
    }
  }, [people, isLoaded]);

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateField({ field: field as any, value }));
  };

  const handleSubmit = () => {
    if (!formData.firstname || !formData.lastname) return;

    if (formData.id) {
      dispatch(
        updatePerson({
          id: formData.id,
          title: formData.title,
          firstname: formData.firstname,
          lastname: formData.lastname,
          birthday: formData.birthday,
          nationality: formData.nationality,
          citizenid: formData.citizenid,
          phone: formData.phone,
          mobileCode: formData.mobileCode,
          passport: formData.passport,
          salary: formData.salary,
          gender: formData.gender,
        })
      );
    } else {
      dispatch(
        addPerson({
          id: uuidv4(),
          title: formData.title,
          firstname: formData.firstname,
          lastname: formData.lastname,
          birthday: formData.birthday,
          nationality: formData.nationality,
          citizenid: formData.citizenid,
          phone: formData.phone,
          mobileCode: formData.mobileCode,
          passport: formData.passport,
          salary: formData.salary,
          gender: formData.gender,
        })
      );
    }
    dispatch(resetForm());
  };

  const onEdit = (record: Person) => {
    dispatch(
      setEditMode({
        id: record.id,
        firstname: record.firstname,
        lastname: record.lastname,
        title: record.title,
        birthday: record.birthday,
        nationality: record.nationality,
        citizenid: record.citizenid,
        phone: record.phone,
        mobileCode: record.mobileCode,
        passport: record.passport,
        salary: record.salary,
        gender: record.gender,
      })
    );
  };

  const onDelete = (id: string) => {
    dispatch(deletePerson(id));
    if (formData.id === id) {
      dispatch(resetForm());
    }
  };
  const columns = [
    {
      title: t("fullname"),
      key: "fullname",
      render: (record: Person) => {
        return `${record.firstname} ${record.lastname}`;
      },
    },
    { title: t("gender"), dataIndex: "gender", key: "gender" },
    {
      title: t("mobilephone"),
      key: "phone",
      render: (_: any, record: Person) => {
        return `${record.mobileCode}${record.phone}`;
      },
    },
    { title: t("nationality"), dataIndex: "nationality", key: "nationality" },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Person) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            ghost
          >
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className=".headerpage">
        <Link href={`/${locale}`} className={styles.headerpage}>
          <span>&lt;</span>
          <span> {t("form-n-table")}</span>
        </Link>
      </div>
      <div className={styles.container}>
        <Card
          title={formData.id ? "Edit Person" : "Add New Person"}
          className={styles.formContainer}
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              <Form.Item label={t("title")} required>
                <Select
                  value={formData.title}
                  onChange={(value) => handleInputChange("title", value)}
                >
                  <Option value={t("mr")}>{t("mr")}</Option>
                  <Option value={t("mrs")}>{t("mrs")}</Option>
                  <Option value={t("ms")}>{t("ms")}</Option>
                </Select>
              </Form.Item>
              <Form.Item label={t("firstname")} required>
                <Input
                  value={formData.firstname}
                  onChange={(e) =>
                    handleInputChange("firstname", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label={t("lastname")} required>
                <Input
                  value={formData.lastname}
                  onChange={(e) =>
                    handleInputChange("lastname", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label={t("birthday")} required>
                <DatePicker
                  onChange={(e) =>
                    handleInputChange("birthday", e?.format("YYYY-MM-DD") || "")
                  }
                />
              </Form.Item>
              <Form.Item label={t("nationality")} required>
                <Select
                  value={formData.nationality}
                  onChange={(value) => handleInputChange("nationality", value)}
                >
                  <Option value={t("thai")}>{t("thai")}</Option>
                  <Option value={t("english")}>{t("english")}</Option>
                  <Option value={t("japanjapanese")}>{t("japanese")}</Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item label={t("citizenid")}>
                <CitizenIdInput
                  value={formData.citizenid}
                  onChange={(val) => handleInputChange("citizenid", val)}
                />
              </Form.Item>
              <Form.Item label={t("gender")} required>
                <Radio.Group
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  value={formData.gender}
                >
                  <Radio value={t("male")}>{t("male")}</Radio>
                  <Radio value={t("female")}>{t("female")}</Radio>
                  <Radio value={t("other")}>{t("other")}</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <Form.Item label={t("mobilephone")} required>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Select
                    value={formData.mobileCode}
                    onChange={(value) => handleInputChange("mobileCode", value)}
                    dropdownStyle={{ minWidth: 150 }}
                    style={{ width: 90 }}
                  >
                    <Option value="+66">🇹🇭 +66</Option>
                    <Option value="+1">🇺🇸 +1</Option>
                    <Option value="+81">🇯🇵 +81</Option>
                  </Select>
                  <Input
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleInputChange("phone", val);
                    }}
                    maxLength={10}
                    inputMode="tel"
                  />
                </div>
              </Form.Item>
            </div>
            <div style={{ width: "350px" }}>
              <Form.Item label={t("passport")}>
                <Input
                  value={formData.passport}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleInputChange("passport", val);
                  }}
                />
              </Form.Item>
            </div>
            <Space>
              <Button type="primary" htmlType="submit">
                {formData.id ? t("update") : t("add")}
              </Button>
              <Button htmlType="button" onClick={() => dispatch(resetForm())}>
                {t("reset")}
              </Button>
              {formData.id && (
                <Button onClick={() => dispatch(resetForm())}>Cancel</Button>
              )}
            </Space>
          </Form>
        </Card>

        <Table
          columns={columns}
          dataSource={people}
          rowKey="id"
          loading={!isLoaded}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
        />
      </div>
    </>
  );
}
