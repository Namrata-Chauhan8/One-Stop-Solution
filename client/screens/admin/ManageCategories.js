import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Layout from "../../components/layouts/Layout";
import api from "../../api/api";

const emptyForm = {
  category: "",
};

const pageSize = 10;

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const endReachedDuringMomentum = useRef(false);

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

      const queryParts = [`page=${nextPage}`, `limit=${pageSize}`];
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
      setPage(categoryRes?.pagination?.currentPage || nextPage);
      setTotalCategories(categoryRes?.pagination?.totalCategories || 0);
      setHasMore(Boolean(categoryRes?.pagination?.hasNextPage));
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load categories");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCategoryId(null);
  };

  const loadMoreCategories = () => {
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

  const handleClearSearch = () => {
    setSearchText("");
    setSearchQuery("");
    setPage(1);
    fetchData({ nextPage: 1, append: false, keyword: "" });
  };

  const handleSubmit = async () => {
    const categoryName = form.category.trim();

    if (!categoryName) {
      Alert.alert("Validation", "Category name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingCategoryId) {
        await api(
          `/category/update-category/${editingCategoryId}`,
          { category: categoryName },
          "PUT",
        );
        Alert.alert("Success", "Category updated successfully");
      } else {
        await api(
          "/category/create-category",
          { category: categoryName },
          "POST",
        );
        Alert.alert("Success", "Category created successfully");
      }

      resetForm();
      await fetchData({ nextPage: 1, append: false, keyword: searchQuery });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setForm({
      category: category.category || "",
    });
  };

  const handleDelete = (category) => {
    Alert.alert(
      "Delete Category",
      `Delete "${category.category}"? Products linked to it will be detached.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api(
                `/category/delete-category/${category._id}`,
                null,
                "DELETE",
              );
              Alert.alert("Success", "Category deleted successfully");
              if (editingCategoryId === category._id) {
                resetForm();
              }
              await fetchData({
                nextPage: 1,
                append: false,
                keyword: searchQuery,
              });
            } catch (error) {
              Alert.alert(
                "Error",
                error.message || "Failed to delete category",
              );
            }
          },
        },
      ],
    );
  };

  const renderCategory = ({ item, index }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTopText}>
            <Text style={styles.cardTitle}>{item.category}</Text>
            <Text style={styles.cardSubtitle}>{item._id}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="calendar" size={14} color="#fff" />
            <Text style={styles.metaText}>
              {item.createdAt ? new Date(item.createdAt).toDateString() : "-"}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="update" size={14} color="#fff" />
            <Text style={styles.metaText}>
              {item.updatedAt ? new Date(item.updatedAt).toDateString() : "-"}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => handleEdit(item)}
          >
            <AntDesign name="edit" size={16} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <AntDesign name="delete" size={16} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Layout scroll={false}>
      <FlatList
        style={styles.container}
        data={categories}
        keyExtractor={(item) => item._id.toString()}
        onRefresh={() => {
          setRefreshing(true);
          fetchData({ nextPage: 1, append: false, keyword: searchQuery });
        }}
        refreshing={refreshing}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={() => {
          if (!endReachedDuringMomentum.current) {
            endReachedDuringMomentum.current = true;
            loadMoreCategories();
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
          ) : !hasMore && categories.length > 0 ? (
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
              <Text style={styles.emptyText}>No categories found.</Text>
            </View>
          )
        }
        renderItem={renderCategory}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.hero}>
              <Text style={styles.title}>Manage Categories</Text>
              <Text style={styles.subtitle}>
                Search, create, update, and delete categories from one place.
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {totalCategories || categories.length}
                  </Text>
                  <Text style={styles.statLabel}>Total Categories</Text>
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.searchRow}>
                <TextInput
                  style={[styles.input, styles.searchInput]}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search categories"
                  placeholderTextColor="#94a3b8"
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
                {editingCategoryId ? "Edit Category" : "Add Category"}
              </Text>

              <TextInput
                style={styles.input}
                value={form.category}
                onChangeText={(text) => setForm({ category: text })}
                placeholder="Category name"
                placeholderTextColor="#94a3b8"
              />

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
                      {editingCategoryId ? "Update Category" : "Add Category"}
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
              <Text style={styles.listHeading}>All Categories</Text>
              <Text style={styles.listSubheading}>
                Tap edit to load a category into the form.
              </Text>
            </View>
          </View>
        }
      />
    </Layout>
  );
};

export default ManageCategories;

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
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    color: "#111827",
    fontSize: 15,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#ff6b6b",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  secondaryBtnText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 15,
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
  card: {
    backgroundColor: "#111827",
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTopText: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#243044",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  loadingWrap: {
    paddingVertical: 28,
  },
  emptyWrap: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#111827",
    borderRadius: 22,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
  },
  emptyText: {
    color: "#cbd5e1",
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 24,
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
