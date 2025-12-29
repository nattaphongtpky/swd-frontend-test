"use client";
import { useTranslation } from "react-i18next";
import { Col, Row, Card } from "antd";
import Link from "next/link";

export default function TestSelection() {
  const { t, i18n } = useTranslation("translation");
  const currentLocale = i18n.language;

  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <Link href={`/${currentLocale}/layoutstyle`}>
            <Card
              title={t("test.1")}
              variant="borderless"
              hoverable
              onClick={() => console.log(`${t("layout-n-style")}`)}
            >
              {t("layout-n-style")}
            </Card>
          </Link>
        </Col>
        <Col className="gutter-row" span={8}>
          <Card
            title={t("test.2")}
            variant="borderless"
            hoverable
            onClick={() => console.log(`${t("connect-api")}`)}
          >
            {t("connect-api")}
          </Card>
        </Col>
        <Col className="gutter-row" span={8}>
          <Link href={`/${currentLocale}/formtable`}>
            <Card title={t("test.3")} variant="borderless" hoverable>
              {t("form-n-table")}
            </Card>
          </Link>
        </Col>
      </Row>
    </>
  );
}
