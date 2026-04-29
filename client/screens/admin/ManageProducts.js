import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Layout from "../../components/layouts/Layout";
import api from "../../api/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryLoadingMore, setCategoryLoadingMore] = useState(false);
  const [categoryPage, setCategoryPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [categoryHasMore, setCategoryHasMore] = useState(false);
  const [categorySearchText, setCategorySearchText] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const endReachedDuringMomentum = useRef(false);
  const categoryEndReachedDuringMomentum = useRef(false);

  const fetchData = async ({
    nextPage = 1,
    append = false,
    keyword = searchQuery,
  } = {}) => {
    const isInitialLoad = nextPage === 1 && !append;
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const queryParts = [`page=${nextPage}`, `limit=10`];
      if (keyword) {
        queryParts.push(`keyword=${encodeURIComponent(keyword)}`);
      }

      const productRes = await api(
        `/product/get-all?${queryParts.join("&")}`,
        null,
        "GET",
      );
      const nextProducts = productRes?.products || [];
      setProducts((current) =>
        append ? [...current, ...nextProducts] : nextProducts,
      );
      setPage(productRes?.pagination?.currentPage || nextPage);
      setTotalProducts(productRes?.pagination?.totalProducts || 0);
      setHasMore(Boolean(productRes?.pagination?.hasNextPage));
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async ({
    nextPage = 1,
    append = false,
    keyword = categorySearchQuery,
  } = {}) => {
    const isInitialLoad = nextPage === 1 && !append;
    try {
      if (isInitialLoad) {
        setCategoryLoading(true);
      } else {
        setCategoryLoadingMore(true);
      }

      const queryParts = [`page=${nextPage}`, `limit=10`];
      if (keyword) {
        queryParts.push(`keyword=${encodeURIComponent(keyword)}`);
      }

      const categoryRes = await api(
        `/category/get-all?${queryParts.join("&")}`,
        null,
        "GET",
      );
      const nextCategories = categoryRes?.categories || [];
      setCategories((current) =>
        append ? [...current, ...nextCategories] : nextCategories,
      );
      setCategoryPage(categoryRes?.pagination?.currentPage || nextPage);
      setTotalCategories(categoryRes?.pagination?.totalCategories || 0);
      setCategoryHasMore(Boolean(categoryRes?.pagination?.hasNextPage));
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load categories");
    } finally {
      setCategoryLoading(false);
      setCategoryLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedImages([]);
    setSelectedImage(null);
    setEditingProductId(null);
    setCategoryDropdownOpen(false);
    setSelectedCategoryName("");
  };

  const loadMoreCategories = () => {
    if (categoryLoading || categoryLoadingMore || !categoryHasMore) {
      return;
    }

    fetchCategories({
      nextPage: categoryPage + 1,
      append: true,
      keyword: categorySearchQuery,
    });
  };

  const loadMoreProducts = () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    fetchData({
      nextPage: page + 1,
      append: true,
      keyword: searchQuery,
    });
  };

  const handleSearch = () => {
    const nextQuery = searchText.trim();
    setSearchQuery(nextQuery);
    setPage(1);
    fetchData({ nextPage: 1, append: false, keyword: nextQuery });
  };

  const handleCategorySearch = () => {
    const nextQuery = categorySearchText.trim();
    setCategorySearchQuery(nextQuery);
    setCategoryPage(1);
    fetchCategories({ nextPage: 1, append: false, keyword: nextQuery });
  };

  const handleClearCategorySearch = () => {
    setCategorySearchText("");
    setCategorySearchQuery("");
    setCategoryPage(1);
    fetchCategories({ nextPage: 1, append: false, keyword: "" });
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchQuery("");
    setPage(1);
    fetchData({ nextPage: 1, append: false, keyword: "" });
  };

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to select product images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setSelectedImages((current) => {
      const merged = [...current];
      result.assets.forEach((asset) => {
        if (!merged.some((item) => item.uri === asset.uri)) {
          merged.push(asset);
        }
      });
      return merged;
    });
  };

  const removeSelectedImage = (uri) => {
    setSelectedImages((current) => current.filter((item) => item.uri !== uri));
  };

  const uploadImage = async (productId, imageAsset) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageAsset.uri,
      name: imageAsset.fileName || `product-${Date.now()}.jpg`,
      type: imageAsset.mimeType || "image/jpeg",
    });
    await api(`/product/update-image/${productId}`, formData, "PUT");
  };

  const createProduct = async () => {
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.price.trim() ||
      !form.stock.trim()
    ) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    if (!form.category) {
      Alert.alert("Validation", "Please select a category.");
      return;
    }

    if (!selectedImages.length) {
      Alert.alert("Validation", "Please select at least one product image.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price.trim());
      formData.append("stock", form.stock.trim());
      formData.append("category", form.category);
      selectedImages.forEach((image, index) => {
        formData.append("files", {
          uri: image.uri,
          name: image.fileName || `product-${Date.now()}-${index}.jpg`,
          type: image.mimeType || "image/jpeg",
        });
      });

      await api("/product/create-product", formData, "POST");
      Alert.alert("Success", "Product created successfully");
      resetForm();
      await fetchData({ nextPage: 1, append: false, keyword: searchQuery });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async () => {
    if (!editingProductId) return;
    if (!form.category) {
      Alert.alert("Validation", "Please select a category.");
      return;
    }
    setSaving(true);
    try {
      await api(
        `/product/${editingProductId}`,
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: form.price.trim(),
          stock: form.stock.trim(),
          category: form.category,
        },
        "PUT",
      );

      if (selectedImage?.uri) {
        await uploadImage(editingProductId, selectedImage);
      }

      Alert.alert("Success", "Product updated successfully");
      resetForm();
      await fetchData({ nextPage: 1, append: false, keyword: searchQuery });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = () => {
    if (editingProductId) {
      updateProduct();
    } else {
      createProduct();
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      category: product.category?._id || product.category || "",
    });
    setSelectedCategoryName(product.category?.category || "");
    setSelectedImages([]);
    setSelectedImage(product.images?.[0] || null);
    setCategoryDropdownOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert("Delete Product", "This will remove the product permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api(`/product/${productId}`, null, "DELETE");
            Alert.alert("Success", "Product deleted successfully");
            await fetchData({
              nextPage: 1,
              append: false,
              keyword: searchQuery,
            });
          } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete product");
          }
        },
      },
    ]);
  };

  const handleDeleteImage = (productId, imageId) => {
    Alert.alert("Delete Image", "Remove this product image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api(
              `/product/delete-image/${productId}?id=${imageId}`,
              null,
              "DELETE",
            );
            Alert.alert("Success", "Image deleted successfully");
            await fetchData({
              nextPage: 1,
              append: false,
              keyword: searchQuery,
            });
          } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete image");
          }
        },
      },
    ]);
  };

  const renderProduct = ({ item }) => {
    const images = item.images || [];
    const coverImage = images[0]?.url;

    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productImageWrap}>
            <Image
              source={{
                uri:
                  coverImage ||
                  "https://cdn-icons-png.flaticon.com/512/2331/2331970.png",
              }}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productHeaderText}>
            <Text style={styles.productTitle}>{item.name}</Text>
            <Text style={styles.productCategory}>
              {item.category?.category || "Uncategorized"}
            </Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={4}>
          {item.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons
              name="cube-outline"
              size={16}
              color="#fff"
            />
            <Text style={styles.metaText}>Stock: {item.stock}</Text>
          </View>

          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="star" size={16} color="#fff" />
            <Text style={styles.metaText}>
              {item.rating || 0} ({item.numReviews || 0})
            </Text>
          </View>
        </View>

        <View style={styles.detailGrid}>
          <Text style={styles.detailText}>ID: {item._id}</Text>
          <Text style={styles.detailText}>
            Created:{" "}
            {item.createdAt ? new Date(item.createdAt).toDateString() : "-"}
          </Text>
          <Text style={styles.detailText}>
            Updated:{" "}
            {item.updatedAt ? new Date(item.updatedAt).toDateString() : "-"}
          </Text>
        </View>

        {images.length > 0 && (
          <View style={styles.imageStrip}>
            <Text style={styles.sectionLabel}>Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image) => (
                <View key={image._id} style={styles.thumbWrap}>
                  <Image source={{ uri: image.url }} style={styles.thumb} />
                  <TouchableOpacity
                    style={styles.thumbDelete}
                    onPress={() => handleDeleteImage(item._id, image._id)}
                  >
                    <AntDesign name="close" size={10} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actionRow}>
          <Pressable style={styles.editBtn} onPress={() => handleEdit(item)}>
            <AntDesign name="edit" size={16} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable
            style={styles.imageBtn}
            onPress={async () => {
              try {
                const permission =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                  Alert.alert(
                    "Permission required",
                    "Please allow photo library access to add an image.",
                  );
                  return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.85,
                });

                if (result.canceled || !result.assets?.length) return;
                await uploadImage(item._id, result.assets[0]);
                Alert.alert("Success", "Image added successfully");
                await fetchData({
                  nextPage: 1,
                  append: false,
                  keyword: searchQuery,
                });
              } catch (error) {
                Alert.alert("Error", error.message || "Failed to add image");
              }
            }}
          >
            <AntDesign name="plus" size={16} color="#fff" />
            <Text style={styles.actionText}>Add Image</Text>
          </Pressable>
          <Pressable
            style={styles.deleteBtn}
            onPress={() => handleDeleteProduct(item._id)}
          >
            <AntDesign name="delete" size={16} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <Layout scroll={false}>
      <FlatList
        style={styles.container}
        data={products}
        keyExtractor={(item) => item._id.toString()}
        onRefresh={() => {
          setRefreshing(true);
          fetchData({ nextPage: 1, append: false, keyword: searchQuery });
          fetchCategories({
            nextPage: 1,
            append: false,
            keyword: categorySearchQuery,
          });
        }}
        refreshing={refreshing}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.hero}>
              <Text style={styles.title}>Manage Products</Text>
              <Text style={styles.subtitle}>
                Create, update, delete, and inspect every product in one place.
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {totalProducts || products.length}
                  </Text>
                  <Text style={styles.statLabel}>Total Products</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {totalCategories || categories.length}
                  </Text>
                  <Text style={styles.statLabel}>Categories</Text>
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.searchRow}>
                <TextInput
                  style={[styles.input, styles.searchInput]}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search products"
                  placeholderTextColor="#777"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={handleSearch}
                >
                  <AntDesign name="search" size={16} color="#fff" />
                </TouchableOpacity>
                {searchQuery ? (
                  <TouchableOpacity
                    style={styles.clearSearchBtn}
                    onPress={handleClearSearch}
                  >
                    <Text style={styles.clearSearchText}>Clear</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text style={styles.formHeading}>
                {editingProductId ? "Edit Product" : "Add Product"}
              </Text>

              <View style={styles.dropdownGroup}>
                <Text style={styles.dropdownLabel}>Category *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setCategoryDropdownOpen(true)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !form.category && styles.dropdownPlaceholder,
                    ]}
                  >
                    {selectedCategoryName ||
                      categories.find((item) => item._id === form.category)
                        ?.category ||
                      "Select a category"}
                  </Text>
                  <AntDesign
                    name="down"
                    size={14}
                    color={form.category ? "#111827" : "#9ca3af"}
                  />
                </TouchableOpacity>
              </View>

              <Modal
                visible={categoryDropdownOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setCategoryDropdownOpen(false)}
              >
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setCategoryDropdownOpen(false)}
                >
                  <View
                    style={styles.dropdownMenu}
                    onStartShouldSetResponder={() => true}
                  >
                    <Text style={styles.dropdownMenuTitle}>
                      Choose a category
                    </Text>
                    <View style={styles.searchRow}>
                      <TextInput
                        style={[styles.input, styles.searchInput]}
                        value={categorySearchText}
                        onChangeText={setCategorySearchText}
                        placeholder="Search categories"
                        placeholderTextColor="#777"
                        returnKeyType="search"
                        onSubmitEditing={handleCategorySearch}
                      />
                      <TouchableOpacity
                        style={styles.searchBtn}
                        onPress={handleCategorySearch}
                      >
                        <AntDesign name="search1" size={16} color="#fff" />
                      </TouchableOpacity>
                      {categorySearchQuery ? (
                        <TouchableOpacity
                          style={styles.clearSearchBtn}
                          onPress={handleClearCategorySearch}
                        >
                          <Text style={styles.clearSearchText}>Clear</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    <FlatList
                      data={categories}
                      keyExtractor={(item) => item._id.toString()}
                      style={styles.dropdownList}
                      contentContainerStyle={styles.dropdownScroll}
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled
                      onEndReached={() => {
                        if (!categoryEndReachedDuringMomentum.current) {
                          categoryEndReachedDuringMomentum.current = true;
                          loadMoreCategories();
                        }
                      }}
                      onEndReachedThreshold={0.35}
                      onMomentumScrollBegin={() => {
                        categoryEndReachedDuringMomentum.current = false;
                      }}
                      ListFooterComponent={
                        categoryLoadingMore ? (
                          <View style={styles.dropdownFooter}>
                            <ActivityIndicator size="small" color="#111827" />
                          </View>
                        ) : null
                      }
                      ListEmptyComponent={
                        categoryLoading ? (
                          <View style={styles.dropdownFooter}>
                            <ActivityIndicator size="small" color="#111827" />
                          </View>
                        ) : (
                          <Text style={styles.dropdownPlaceholder}>
                            No categories found
                          </Text>
                        )
                      }
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          key={item._id}
                          style={[
                            styles.dropdownOption,
                            form.category === item._id &&
                              styles.dropdownOptionActive,
                          ]}
                          onPress={() => {
                            setForm({ ...form, category: item._id });
                            setSelectedCategoryName(item.category);
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              form.category === item._id &&
                                styles.dropdownOptionTextActive,
                            ]}
                          >
                            {item.category}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </Pressable>
              </Modal>

              <View style={styles.inputGrid}>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  placeholder="Product name"
                  placeholderTextColor="#777"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={form.description}
                  onChangeText={(text) =>
                    setForm({ ...form, description: text })
                  }
                  placeholder="Product description"
                  placeholderTextColor="#777"
                  multiline
                />
                <View style={styles.rowInputs}>
                  <TextInput
                    style={[styles.input, styles.flexInput]}
                    value={form.price}
                    onChangeText={(text) => setForm({ ...form, price: text })}
                    placeholder="Price"
                    keyboardType="numeric"
                    placeholderTextColor="#777"
                  />
                  <TextInput
                    style={[styles.input, styles.flexInput]}
                    value={form.stock}
                    onChangeText={(text) => setForm({ ...form, stock: text })}
                    placeholder="Stock"
                    keyboardType="numeric"
                    placeholderTextColor="#777"
                  />
                </View>

                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImages}
                >
                  <AntDesign name="picture" size={18} color="#fff" />
                  <Text style={styles.imagePickerText}>
                    {selectedImages.length
                      ? `Add More Images (${selectedImages.length})`
                      : "Pick Product Images"}
                  </Text>
                </TouchableOpacity>

                {selectedImages.length > 0 ? (
                  <View style={styles.previewSection}>
                    <Text style={styles.previewLabel}>Selected Images</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.previewRow}
                    >
                      {selectedImages.map((image) => (
                        <View key={image.uri} style={styles.previewWrap}>
                          <Image
                            source={{ uri: image.uri }}
                            style={styles.preview}
                          />
                          <TouchableOpacity
                            style={styles.previewRemove}
                            onPress={() => removeSelectedImage(image.uri)}
                          >
                            <AntDesign name="close" size={14} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      {editingProductId ? "Update Product" : "Add Product"}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={resetForm}
                  disabled={saving}
                >
                  <Text style={styles.secondaryBtnText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.listHeadingWrap}>
              <Text style={styles.listHeading}>All Products</Text>
              <Text style={styles.listSubheading}>
                Tap edit to load a product into the form.
              </Text>
            </View>
          </View>
        }
        onEndReached={() => {
          if (!endReachedDuringMomentum.current) {
            endReachedDuringMomentum.current = true;
            loadMoreProducts();
          }
        }}
        onEndReachedThreshold={0.35}
        onMomentumScrollBegin={() => {
          endReachedDuringMomentum.current = false;
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerWrap}>
              <ActivityIndicator size="small" color="#FF6B6B" />
            </View>
          ) : !hasMore && products.length > 0 ? (
            <View style={styles.footerWrap}>
              <Text style={styles.footerText}>You've reached the end.</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          )
        }
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
      />
    </Layout>
  );
};

export default ManageProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  headerWrap: {
    padding: 16,
  },
  hero: {
    backgroundColor: "#111827",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#cbd5e1",
    marginTop: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#243044",
  },
  statNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: "#94a3b8",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
  },
  searchBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  clearSearchBtn: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  clearSearchText: {
    color: "#111827",
    fontWeight: "700",
  },
  formHeading: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111827",
  },
  dropdownGroup: {
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
  },
  dropdownPlaceholder: {
    color: "#9ca3af",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    maxHeight: "60%",
  },
  dropdownMenuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  dropdownScroll: {
    gap: 10,
    paddingVertical: 2,
    paddingBottom: 10,
  },
  dropdownList: {
    maxHeight: 320,
  },
  dropdownFooter: {
    paddingVertical: 14,
    alignItems: "center",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    marginBottom: 10,
  },
  dropdownOptionActive: {
    backgroundColor: "#111827",
  },
  dropdownOptionText: {
    color: "#111827",
    fontWeight: "700",
  },
  dropdownOptionTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  inputGrid: {
    marginTop: 12,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 10,
  },
  flexInput: {
    flex: 1,
  },
  imagePicker: {
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "700",
  },
  previewSection: {
    gap: 8,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  previewRow: {
    gap: 10,
    paddingVertical: 2,
  },
  previewWrap: {
    alignSelf: "flex-start",
    position: "relative",
    marginRight: 2,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  previewRemove: {
    position: "absolute",
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
  secondaryBtn: {
    width: 100,
    backgroundColor: "#e5e7eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#111827",
    fontWeight: "700",
  },
  listHeadingWrap: {
    marginBottom: 12,
  },
  listHeading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  listSubheading: {
    color: "#94a3b8",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 140,
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: "row",
    gap: 12,
  },
  productImageWrap: {
    width: 92,
    height: 92,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productHeaderText: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  productCategory: {
    marginTop: 4,
    color: "#6b7280",
    fontWeight: "600",
  },
  productPrice: {
    marginTop: 6,
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "800",
  },
  description: {
    marginTop: 12,
    color: "#374151",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  metaText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  detailGrid: {
    marginTop: 12,
    gap: 6,
  },
  detailText: {
    color: "#475569",
    fontSize: 12,
  },
  imageStrip: {
    marginTop: 14,
  },
  sectionLabel: {
    fontWeight: "800",
    marginBottom: 8,
    color: "#111827",
  },
  thumbWrap: {
    marginRight: 10,
    position: "relative",
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  thumbDelete: {
    position: "absolute",
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imageBtn: {
    flex: 1,
    backgroundColor: "#7c3aed",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "800",
  },
  loadingWrap: {
    paddingVertical: 50,
  },
  emptyWrap: {
    paddingVertical: 50,
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontWeight: "700",
  },
  footerWrap: {
    paddingTop: 4,
    paddingBottom: 18,
    alignItems: "center",
  },
  footerText: {
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "600",
  },
});
