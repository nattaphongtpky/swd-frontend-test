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
  deletePeople,
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { t } = useTranslation("translation");

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleBulkDelete = () => {
    dispatch(deletePeople(selectedRowKeys as string[]));

    setSelectedRowKeys([]);

    if (formData.id && selectedRowKeys.includes(formData.id)) {
      dispatch(resetForm());
    }
  };

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
    {
      title: t("gender"),
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        return <span>{t(`genders.${gender}`) || gender}</span>;
      },
    },
    {
      title: t("mobilephone"),
      key: "phone",
      render: (_: any, record: Person) => {
        return `${record.mobileCode}${record.phone}`;
      },
    },
    {
      title: t("nationality"),
      dataIndex: "nationality",
      key: "nationality",
      render: (nationality: string) => {
        return <span>{nationality ? t(`${nationality}`) : "-"}</span>;
      },
    },

    {
      title: t("action"),
      key: "action",
      render: (_: any, record: Person) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            ghost
          >
            {t("edit")}
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
            <Button type="primary" danger icon={<DeleteOutlined />}>
              {t("delete")}
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
          title={formData.id ? t("edit_person") : t("add_new_person")}
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
                  <Option value="thai">{t("thai")}</Option>
                  <Option value="english">{t("english")}</Option>
                  <Option value="japanese">{t("japanese")}</Option>
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
                  <Radio value="male">{t("genders.male")}</Radio>
                  <Radio value="female">{t("genders.female")}</Radio>
                  <Radio value="other">{t("genders.other")}</Radio>
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
                <Space.Compact>
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
                </Space.Compact>
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
            <div style={{ width: "350px" }}>
              <Form.Item label={t("salary")} required>
                <InputNumber
                  style={{ width: "100%" }}
                  value={formData.salary ? Number(formData.salary) : 0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                  onChange={(value) =>
                    handleInputChange("salary", value ? value.toString() : "")
                  }
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
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`${t("delete")} ${selectedRowKeys.length} items?`}
              onConfirm={handleBulkDelete}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                {t("delete")} ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={people}
          rowKey="id"
          loading={!isLoaded}
          rowSelection={rowSelection}
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
