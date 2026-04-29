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
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Layout from "../../components/layouts/Layout";
import api from "../../api/api";

const pageSize = 10;
const roleOptions = [
  { label: "All", value: "" },
  { label: "Users", value: "user" },
  { label: "Admins", value: "admin" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const endReachedDuringMomentum = useRef(false);

  const fetchData = async ({
    nextPage = 1,
    append = false,
    keyword = searchQuery,
    role = roleFilter,
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
      if (role) {
        queryParts.push(`role=${encodeURIComponent(role)}`);
      }

      const userRes = await api(
        `/user/admin/get-all?${queryParts.join("&")}`,
        null,
        "GET",
      );
      const nextUsers = userRes?.users || [];
      setUsers((current) => (append ? [...current, ...nextUsers] : nextUsers));
      setPage(userRes?.pagination?.currentPage || nextPage);
      setTotalUsers(userRes?.pagination?.totalUsers || 0);
      setHasMore(Boolean(userRes?.pagination?.hasNextPage));
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load users");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreUsers = () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    fetchData({
      nextPage: page + 1,
      append: true,
      keyword: searchQuery,
      role: roleFilter,
    });
  };

  const handleSearch = () => {
    const nextQuery = searchText.trim();
    setSearchQuery(nextQuery);
    setPage(1);
    fetchData({
      nextPage: 1,
      append: false,
      keyword: nextQuery,
      role: roleFilter,
    });
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchQuery("");
    setRoleFilter("");
    setPage(1);
    fetchData({ nextPage: 1, append: false, keyword: "", role: "" });
  };

  const handleRoleChange = (nextRole) => {
    setRoleFilter(nextRole);
    setPage(1);
    fetchData({
      nextPage: 1,
      append: false,
      keyword: searchQuery,
      role: nextRole,
    });
  };

  const renderUser = ({ item, index }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.badge}>
            <Feather name="user" size={20} color="#fff" />
          </View>
          <View style={styles.cardTopText}>
            <Text style={styles.cardTitle}>{item.name || "Unnamed User"}</Text>
            <Text style={styles.cardSubtitle}>{item.email || "-"}</Text>
          </View>
          <View style={styles.indexChip}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="phone" size={14} color="#fff" />
            <Text style={styles.metaText}>{item.phone || "-"}</Text>
          </View>
          <View
            style={[
              styles.metaChip,
              item.role === "admin" ? styles.adminChip : styles.userChip,
            ]}
          >
            <MaterialCommunityIcons
              name="shield-account"
              size={14}
              color="#fff"
            />
            <Text style={styles.metaText}>{item.role || "user"}</Text>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>{item.address || "-"}</Text>
          <Text style={styles.infoText}>
            {[item.city, item.country].filter(Boolean).join(", ") || "-"}
          </Text>
        </View>

        <View style={styles.detailGrid}>
          <Text style={styles.detailText}>ID: {item._id}</Text>
          <Text style={styles.detailText}>
            Joined:{" "}
            {item.createdAt ? new Date(item.createdAt).toDateString() : "-"}
          </Text>
          <Text style={styles.detailText}>
            Updated:{" "}
            {item.updatedAt ? new Date(item.updatedAt).toDateString() : "-"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Layout scroll={false}>
      <FlatList
        style={styles.container}
        data={users}
        keyExtractor={(item) => item._id.toString()}
        onRefresh={() => {
          setRefreshing(true);
          fetchData({
            nextPage: 1,
            append: false,
            keyword: searchQuery,
            role: roleFilter,
          });
        }}
        refreshing={refreshing}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={() => {
          if (!endReachedDuringMomentum.current) {
            endReachedDuringMomentum.current = true;
            loadMoreUsers();
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
          ) : !hasMore && users.length > 0 ? (
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
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          )
        }
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.hero}>
              <Text style={styles.title}>Manage Users</Text>
              <Text style={styles.subtitle}>
                Search registered users by name, email, phone, or role.
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {totalUsers || users.length}
                  </Text>
                  <Text style={styles.statLabel}>Total Users</Text>
                </View>
              </View>
            </View>

            <View style={styles.searchCard}>
              <View style={styles.searchRow}>
                <TextInput
                  style={[styles.input, styles.searchInput]}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search users"
                  placeholderTextColor="#94a3b8"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={handleSearch}
                >
                  <AntDesign name="" size={16} color="#fff" />
                </TouchableOpacity>
                {searchQuery || roleFilter ? (
                  <TouchableOpacity
                    style={styles.clearSearchBtn}
                    onPress={handleClearSearch}
                  >
                    <Text style={styles.clearSearchText}>Clear</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.filterRow}>
                {roleOptions.map((option) => {
                  const active = roleFilter === option.value;
                  return (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.filterChip,
                        active && styles.filterChipActive,
                      ]}
                      onPress={() => handleRoleChange(option.value)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          active && styles.filterChipTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        }
      />
    </Layout>
  );
};

export default ManageUsers;

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
  searchCard: {
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: "#ff6b6b",
  },
  filterChipText: {
    color: "#111827",
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#fff",
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
  badge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
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
  adminChip: {
    backgroundColor: "#3b82f6",
  },
  userChip: {},
  metaText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoBlock: {
    marginTop: 12,
    gap: 6,
  },
  infoText: {
    color: "#cbd5e1",
    lineHeight: 18,
  },
  detailGrid: {
    marginTop: 12,
    gap: 6,
  },
  detailText: {
    color: "#94a3b8",
    fontSize: 12,
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
