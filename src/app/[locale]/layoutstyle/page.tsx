"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Col, Row, Flex } from "antd";

interface Props {
  params: {
    locale: string;
  };
}

const init_shape = [
  "circle",
  "square",
  "ellipse",
  "trapezoid",
  "rectangle",
  "parallelogram",
];

export default function LayoutAndStylePage({ params: { locale } }: Props) {
  const { t } = useTranslation("translation");

  const [shapes, setShapes] = useState<string[]>(init_shape);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);

  const MoveShapeLeft = () => {
    setShapes((prevShapes) => {
      const newShapes = [...prevShapes];
      const firstShape = newShapes.shift();
      if (firstShape) {
        newShapes.push(firstShape);
      }
      return newShapes;
    });
  };

  const MoveShapeRight = () => {
    setShapes((prevShapes) => {
      const newShapes = [...prevShapes];
      const lastShape = newShapes.pop();
      if (lastShape) {
        newShapes.unshift(lastShape);
      }
      return newShapes;
    });
  };

  const handleMovePosition = () => {
    setIsSwapped((prev) => !prev);
  };

  const handleShapeRandom = () => {
    setShapes((prevShapes) => {
      const newShapes = [...prevShapes];
      for (let i = newShapes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newShapes[i], newShapes[j]] = [newShapes[j], newShapes[i]];
      }
      return newShapes;
    });
  };

  return (
    <>
      <div className="container">
        <Link href={`/${locale}`} className={styles.headerpage}>
          <span>&lt;</span>
          <span>{t("layout-n-style")}</span>
        </Link>
        <div className={styles.container}>
          <Row justify="space-between">
            <Col className={styles.card} span={6} onClick={MoveShapeLeft}>
              <Flex align="center" justify={"center"}>
                <div className={styles.shape_left} />
                <div className={styles.label}>{t("move_shape")}</div>
              </Flex>
            </Col>
            <Col span={10} className={styles.card} onClick={handleMovePosition}>
              <Flex gap="large" align="center" justify={"space-around"}>
                <div className={styles.shape_up} />
                <div className={styles.shape_down} />
                <div className={styles.label}>{t("move_position")}</div>
              </Flex>
            </Col>
            <Col className={styles.card} span={6} onClick={MoveShapeRight}>
              <Flex gap="large" align="center" justify={"center"}>
                <div className={styles.shape_right} />
                <div className={styles.label}>{t("move_shape")}</div>
              </Flex>
            </Col>
          </Row>
          <div
            style={{
              width: "100%",
              height: "1px",
              margin: "20px 0",
              border: "none",
              backgroundColor: "black",
            }}
          />
          <Row justify={isSwapped ? "start" : "end"}>
            {shapes.slice(0, 3).map((shape, index) => (
              <Col
                className={styles.card}
                span={6}
                key={`row1-${index}`}
                onClick={handleShapeRandom}
              >
                <Flex gap="large" align="center" justify={"center"}>
                  <div className={styles[shape]} />
                </Flex>
              </Col>
            ))}
          </Row>

          <Row justify={isSwapped ? "end" : "start"}>
            {shapes.slice(3).map((shape, index) => (
              <Col
                className={styles.card}
                span={6}
                key={`row2-${index}`}
                onClick={handleShapeRandom}
              >
                <Flex gap="large" align="center" justify={"center"}>
                  <div className={styles[shape]} />
                </Flex>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
}
