import { useEffect, useState } from "react";
import { Modal, Button, Input, Form, message, Table, Upload, Image, Row, Col, Card, Spin } from "antd";
import { doc, updateDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { useParams } from "react-router-dom";
import { FStore } from "../../common/config/firebase/firebase.config";

type Item = {
    id: string;
    title: string;
    price: number;
    description: string;
    subcategory: string;
    file?: { url: string } | File;
};

const subcategoriesMap: Record<string, string[]> = {
    jeans: ["Straight Fit", "Slim Fit", "Bootcut"],
    shirts: ["Casual", "Formal"],
    t_shirts: ["Round Neck", "V Neck", "Polo"],
    hoodies: ["Zipped", "Pullover"],
    track_pants: ["Joggers", "Sweatpants"],
    shorts: ["Sport Shorts", "Casual Shorts"],
    perfumes: ["Floral", "Woody", "Citrus"],
    undergarments: ["Briefs", "Boxers", "Thermal"],
    socks: ["Ankle", "Crew", "Knee High"],
};

const CategoryPage = () => {
    const router = useParams();
    const { id } = router;
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState<boolean>(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const storage = getStorage();

    useEffect(() => {
        if (id) {
            setLoading(true);
            const unsubscribe = onSnapshot(collection(FStore, id as string), (snapshot) => {
                const itemsArray: Item[] = [];
                snapshot.forEach((doc) => {
                    itemsArray.push({ id: doc.id, ...doc.data() } as Item);
                });
                setItems(itemsArray);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [id]);

    const showModal = (item: Item) => {
        setLoading(true);
        setSelectedItem(item);
        setIsModalVisible(true);
        setLoading(false);
    };

    const handleCancel = () => {
        setLoading(true);
        setIsModalVisible(false);
        setSelectedItem(null);
        setLoading(false);
    };

    const handleUpdate = async (values: Omit<Item, "id" | "file">) => {
        if (!selectedItem) return;

        try {
            setLoading(true);
            let updatedFileUrl = selectedItem.file instanceof File ? "" : selectedItem.file?.url;

            if (selectedItem.file instanceof File) {
                const storageRef = ref(storage, `${id}/${selectedItem.file.name}`);
                const uploadTask = await uploadBytesResumable(storageRef, selectedItem.file);
                updatedFileUrl = await getDownloadURL(uploadTask.ref);
            }

            const docRef = doc(FStore, id as string, selectedItem.id);
            await updateDoc(docRef, {
                ...values,
                file: { url: updatedFileUrl },
            });

            message.success("Item updated successfully.");
            handleCancel();
        } catch (error) {
            console.error("Error updating item:", error);
            message.error("Failed to update item.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteItemId(id);
        setIsDeleteConfirmVisible(true);
    };

    const handleDelete = async () => {
        if (!deleteItemId) return;
        try {
            setLoading(true);
            const docRef = doc(FStore, id as string, deleteItemId);
            await deleteDoc(docRef);
            message.success("Item deleted successfully.");
            setDeleteItemId(null);
        } catch (error) {
            console.error("Error deleting item:", error);
            message.error("Failed to delete item.");
        } finally {
            setLoading(false);
            setIsDeleteConfirmVisible(false);
        }
    };

    const handleImageChange = (info: UploadChangeParam) => {
        const file = info.fileList[0]?.originFileObj as RcFile;
        if (file) {
            setSelectedItem((prev) => prev ? { ...prev, file } : null);
        }
    };

    const columns = [
        {
            title: "Product Image",
            dataIndex: "file",
            render: (file: { url: string }) => (
                <Image width={50} height={50} src={file?.url} alt="product" className="object-cover rounded-md shadow-md" />
            ),
        },
        {
            title: "Product Title",
            dataIndex: "title",
            render: (text: string) => <span className="font-semibold text-white">{text}</span>,
        },
        {
            title: "Product Price",
            dataIndex: "price",
            render: (price: number) => <span className="text-green-400 font-semibold">Rs {price}</span>,
        },
        {
            title: "Product Subcategory",
            dataIndex: "subcategory",
            render: (text: string) => <span className="text-gray-300">{text}</span>,
        },
        {
            title: "Actions",
            render: (_: number, item: Item) => (
                <div className="flex gap-2">
                    <Button onClick={() => showModal(item)} type="primary" className="bg-blue-500">
                        Edit
                    </Button>
                    <Button danger onClick={() => confirmDelete(item.id)} className="bg-red-500">
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Spin spinning={loading} className="min-h-screen bg-gray-900 text-white p-4 md:p-10">
            {/* Responsive Table for PC, Box Layout for Mobile */}
            <div className="hidden md:block">
                <Table
                    dataSource={items}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    rowHoverable={false}
                    style={{
                        backgroundColor: "#2c2c2c",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    rowClassName={() => "bg-gray-800 hover:bg-gray-700"}
                    bordered={true}
                />
            </div>

            {/* Mobile Box Layout */}
            <div className="block md:hidden">
                <Row gutter={[16, 16]}>
                    {items.map((item) => (
                        <Col xs={24} key={item.id}>
                            <Card
                                className="bg-gray-800 text-white rounded-lg shadow-md p-4"
                                cover={
                                    <Image
                                        width="100%"
                                        height={200}
                                        alt="product"
                                        src={
                                            item.file instanceof File
                                                ? URL.createObjectURL(item.file)
                                                : item.file?.url
                                        }
                                        className="object-contain rounded-md"
                                    />
                                }
                            >
                                <Card.Meta
                                    title={
                                        <span className="font-semibold text-lg sm:text-xl">
                                            {item.title}
                                        </span>
                                    }
                                    description={
                                        <>
                                            <p className="text-gray-400 text-sm sm:text-base">
                                                Price: Rs. {item.price}
                                            </p>
                                            <p className="text-gray-400 text-sm sm:text-base">
                                                Subcategory: {item.subcategory}
                                            </p>
                                        </>
                                    }
                                />
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        onClick={() => showModal(item)}
                                        type="primary"
                                        className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => confirmDelete(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white w-full"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>


            {selectedItem && (
                <Modal
                    title={<span className="text-black text-lg font-bold">Edit {selectedItem.title}</span>}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    className="custom-modal"
                    bodyStyle={{
                        backgroundColor: "#1e1e1e",
                        borderRadius: "10px",
                        padding: "20px",
                    }}
                    centered
                >
                    <Form
                        layout="vertical"
                        initialValues={{
                            title: selectedItem.title,
                            price: selectedItem.price,
                            description: selectedItem.description,
                            subcategory: selectedItem.subcategory,
                        }}
                        onFinish={handleUpdate}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="title"
                                    label={<span className="text-gray-300">Title</span>}
                                    rules={[{ required: true, message: "Please input the title!" }]}
                                >
                                    <Input className="bg-gray-800 text-white rounded-md focus:bg-gray-800 focus:border-gray-600 hover:bg-gray-800" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="price"
                                    label={<span className="text-gray-300">Price</span>}
                                    rules={[{ required: true, message: "Please input the price!" }]}
                                >
                                    <Input className="bg-gray-800 text-white rounded-md focus:bg-gray-800 focus:border-gray-600 hover:bg-gray-800" type="number" />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    name="description"
                                    label={<span className="text-gray-300">Description</span>}
                                >
                                    <Input.TextArea className="bg-gray-800 text-white rounded-md focus:bg-gray-800 focus:border-gray-600 hover:bg-gray-800" />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    name="subcategory"
                                    label={<span className="text-gray-300">Subcategory</span>}
                                    rules={[{ required: true, message: "Please select a subcategory!" }]}
                                >
                                    <select style={{ backgroundColor: "#1F2937" }}
                                        className="w-full p-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none text-white"
                                    >

                                        {(subcategoriesMap[id as keyof typeof subcategoriesMap] || []).map((subcategory: string) => (
                                            <option key={subcategory} value={subcategory} className="bg-gray-900 rounded-lg border border-gray-700 focus:outline-none text-white">
                                                {subcategory}
                                            </option>
                                        ))}

                                    </select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} style={{ display: "flex", justifyContent: "space-between" }}>

                                <Form.Item label={<span className="text-gray-300">Product Image</span>}>

                                    {selectedItem.file && (
                                        <img
                                            className="mt-4 object-cover rounded-md shadow-md"
                                            src={
                                                selectedItem.file instanceof File
                                                    ? URL.createObjectURL(selectedItem.file)  // If it's a File, generate a URL
                                                    : selectedItem.file?.url  // If it's an object with a URL
                                            }
                                            alt="Selected product"
                                        />
                                    )}

                                </Form.Item>
                                <Form.Item label={<span className="text-gray-300">Select Image</span>}>
                                    <Upload
                                        className="bg-gray-800 text-white rounded-md"
                                        listType="picture"
                                        maxCount={1}
                                        showUploadList={false}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        beforeUpload={() => false}
                                    >
                                        <Button icon={<UploadOutlined />}>Select Image</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end">
                            <Col>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Update
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteConfirmVisible}
                onCancel={() => setIsDeleteConfirmVisible(false)}
                onOk={handleDelete}
                okText="Yes, Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>
        </Spin>
    );
};

export default CategoryPage;
