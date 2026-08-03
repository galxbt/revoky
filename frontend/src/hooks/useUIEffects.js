// frontend/src/hooks/useUIEffects.js

import { useEffect } from "react";

export function useUIEffects({
  state,
  setters,
  refs,
  derived,
}) {
  const {
    approvals,
    visibleCount,
    loadStep,
    hasScanned,
    isEnriched,
    error,
  } = state;

  const {
    setShowAddressMenu,
    setShowChainDropdown,
    setShowScrollTop,
    setShowQuickLinks,
    setVisibleCount,
    setAnimatedIds,
    setError,
  } = setters;

  const {
    addressMenuRef,
    dropdownRef,
    loadMoreRef,
    loadingMoreRef,
  } = refs;
  
  const {
    processedApprovals,
    enrichAddresses,
  } = derived;

  // -------------------------------------
  // CLICK OUTSIDE (ADDRESS MENU)
  // -------------------------------------
 
  useEffect(() => {
    function handleClickOutside(e) {
      if (addressMenuRef.current && !addressMenuRef.current.contains(e.target)) {
        setShowAddressMenu(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // -------------------------------------
  // CLICK OUTSIDE (CHAIN DROPDOWN)
  // -------------------------------------
  
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowChainDropdown(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // -------------------------------------
  // SCROLL → BACK TO TOP
  // -------------------------------------
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // -------------------------------------
  // SCROLL → HIDE QUICK LINKS
  // -------------------------------------
  
  useEffect(() => {
    const handleScroll = () => {
      setShowQuickLinks(false);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // -------------------------------------
  // INITIAL ANIMATION
  // -------------------------------------
  
  useEffect(() => {
    if (processedApprovals.length === 0) {
      return;
    }

    setVisibleCount(loadStep);

    const firstBatch = processedApprovals.slice(0, 5).map(a => a.id);

    setAnimatedIds(new Set(firstBatch));

  }, [processedApprovals]);

  // -------------------------------------
  // INFINITE SCROLL
  // -------------------------------------
  
  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node) return;

    if (visibleCount >= processedApprovals.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !loadingMoreRef.current) {
          loadingMoreRef.current = true;

          setVisibleCount(
            prev =>
              Math.min(
                prev + loadStep,
                processedApprovals.length
              )
          );

          setTimeout(() => {
            loadingMoreRef.current = false;
          }, 200);
        }
      },
      {
        rootMargin: "600px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };

  }, [
    processedApprovals.length,
    visibleCount,
    loadStep,
  ]);

  // -------------------------------------
  // AUTO SCROLL TO TOP
  // -------------------------------------
 
  useEffect(() => {
    if (hasScanned && approvals.length > 0) {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [
    hasScanned,
    approvals.length,
  ]);

  // -------------------------------------
  // ENRICH ADDRESSES
  // -------------------------------------
  
  useEffect(() => {
    if (!isEnriched) return;
  
    enrichAddresses(approvals);
  }, [
    isEnriched,
    approvals,
  ]);

  // -------------------------------------
  // AUTO CLEAR ERROR
  // -------------------------------------
  
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError("");
    }, 4000);

    return () =>
      clearTimeout(timer);

  }, [
    error,
    setError,
  ]);
}