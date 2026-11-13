async function hydrateChunkedImage(img){
  const paths=(img.dataset.chunks||"").split(",").map(s=>s.trim()).filter(Boolean);
  if(!paths.length) return;
  try{
    const parts=await Promise.all(paths.map(async path=>{
      const res=await fetch(path,{cache:"force-cache"});
      if(!res.ok) throw new Error("asset "+path+" "+res.status);
      return (await res.text()).trim();
    }));
    img.src="data:image/webp;base64,"+parts.join("");
    img.classList.add("is-loaded");
  }catch(err){
    console.error("Image load failed",err);
    img.alt="";
    img.closest("figure")?.classList.add("image-failed");
  }
}
document.querySelectorAll("img[data-chunks]").forEach(hydrateChunkedImage);