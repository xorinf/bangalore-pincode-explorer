import { jest } from "@jest/globals";

// We test the JSON fallback path (no MySQL required)
// Import the seed data to validate
import bangalorePincodes from "../data/pincodes.js";

describe("Bangalore Pincode Data", () => {
  test("should have at least 100 pincode entries", () => {
    expect(bangalorePincodes.length).toBeGreaterThanOrEqual(100);
  });

  test("each entry should have required fields", () => {
    bangalorePincodes.forEach((entry) => {
      expect(entry).toHaveProperty("pincode");
      expect(entry).toHaveProperty("area_name");
      expect(entry).toHaveProperty("district");
      expect(entry).toHaveProperty("state");
    });
  });

  test("all pincodes should be 6-digit strings", () => {
    bangalorePincodes.forEach((entry) => {
      expect(entry.pincode).toMatch(/^\d{6}$/);
    });
  });

  test("all pincodes should be unique", () => {
    const pincodes = bangalorePincodes.map((p) => p.pincode);
    const unique = new Set(pincodes);
    expect(unique.size).toBe(pincodes.length);
  });

  test("all entries should be from Karnataka", () => {
    bangalorePincodes.forEach((entry) => {
      expect(entry.state).toBe("Karnataka");
    });
  });

  test("should contain well-known Bangalore pincodes", () => {
    const pincodes = bangalorePincodes.map((p) => p.pincode);
    expect(pincodes).toContain("560001"); // GPO
    expect(pincodes).toContain("560034"); // Koramangala
    expect(pincodes).toContain("560038"); // Indiranagar
    expect(pincodes).toContain("560043"); // Whitefield
    expect(pincodes).toContain("560047"); // HSR Layout
  });
});

describe("Search Functionality (JSON fallback)", () => {
  // Simulate the search logic from the model
  const searchPincodes = (query) => {
    const q = query.toLowerCase();
    return bangalorePincodes.filter(
      (p) => p.pincode.includes(q) || p.area_name.toLowerCase().includes(q)
    );
  };

  test("should find pincode by exact number", () => {
    const results = searchPincodes("560034");
    expect(results.length).toBe(1);
    expect(results[0].area_name).toBe("Koramangala");
  });

  test("should find pincodes by partial area name", () => {
    const results = searchPincodes("nagar");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(r.area_name.toLowerCase()).toContain("nagar");
    });
  });

  test("should return empty for non-existent pincode", () => {
    const results = searchPincodes("999999");
    expect(results.length).toBe(0);
  });

  test("should find area by partial pincode", () => {
    const results = searchPincodes("5600");
    expect(results.length).toBeGreaterThan(0);
  });

  test("search should be case-insensitive", () => {
    const upper = searchPincodes("KORAMANGALA");
    const lower = searchPincodes("koramangala");
    expect(upper).toEqual(lower);
  });
});

describe("Pagination Logic", () => {
  const paginate = (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const data = bangalorePincodes.slice(offset, offset + limit);
    const total = bangalorePincodes.length;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  };

  test("should return correct page size", () => {
    const result = paginate(1, 10);
    expect(result.data.length).toBe(10);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  test("should calculate total pages correctly", () => {
    const result = paginate(1, 20);
    const expectedPages = Math.ceil(bangalorePincodes.length / 20);
    expect(result.totalPages).toBe(expectedPages);
  });

  test("should return different data for different pages", () => {
    const page1 = paginate(1, 10);
    const page2 = paginate(2, 10);
    expect(page1.data[0].pincode).not.toBe(page2.data[0].pincode);
  });

  test("last page may have fewer items", () => {
    const total = bangalorePincodes.length;
    const lastPage = Math.ceil(total / 10);
    const result = paginate(lastPage, 10);
    expect(result.data.length).toBeLessThanOrEqual(10);
  });
});
