"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PhoneInput, PhoneInputHandle } from "@/components/PhoneInput";

export default function Core() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const phoneInputRef = useRef<PhoneInputHandle>(null);
  const referrerPhoneInputRef = useRef<PhoneInputHandle>(null);

  useEffect(() => {
    const participated = localStorage.getItem("bmhUserHasParticipated")
    setHasParticipated(participated === "true")
    setIsLoading(false)
  }, [])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    referrerName: "",
    referrerPhone: "",
    referrerEmail: "",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    toast({
      variant: type === "error" ? "destructive" : "default",
      title: type === "success" ? "Success" : "Error",
      description: message,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = async () => {
    if (!formData.firstName.trim()) { showToast("Please enter your first name", "error"); return; }
    if (!formData.lastName.trim()) { showToast("Please enter your last name", "error"); return; }
    if (!formData.email.trim()) { showToast("Please enter your email address", "error"); return; }
    if (!formData.phone.trim()) { showToast("Please enter your phone number", "error"); return; }
    
    setValidating(true)
    if (phoneInputRef.current) {
      const result = await phoneInputRef.current.validate()
      if (!result.valid) {
        showToast(result.error || "Invalid phone number", "error")
        setValidating(false)
        return
      }
    }
    setValidating(false)
    
    if (!formData.location.trim()) { showToast("Please enter your location", "error"); return; }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone.trim()) { showToast("Please enter your phone number", "error"); return; }
    
    setValidating(true)
    if (phoneInputRef.current) {
      const result = await phoneInputRef.current.validate()
      if (!result.valid) {
        showToast(result.error || "Invalid phone number", "error")
        setValidating(false)
        return
      }
    }
    
    if (!formData.referrerName.trim()) { showToast("Please enter referrer name", "error"); setValidating(false); return; }
    
    if (formData.referrerPhone.trim() && referrerPhoneInputRef.current) {
      const result = await referrerPhoneInputRef.current.validate()
      if (!result.valid) {
        showToast(result.error || "Invalid referrer phone number", "error")
        setValidating(false)
        return
      }
    }
    setValidating(false)

    setLoading(true);
    const phone = phoneInputRef.current?.getNumber() || formData.phone
    const referrerPhone = formData.referrerPhone.trim() && referrerPhoneInputRef.current 
      ? referrerPhoneInputRef.current.getNumber() 
      : ""

    const dataToSubmit = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: phone,
      location: formData.location,
      referrerName: formData.referrerName,
      referrerPhone: referrerPhone,
      referrerEmail: formData.referrerEmail,
    };

    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dataToSubmit) });
      if (!response.ok) throw new Error("Failed to submit");
      showToast("Form submitted successfully!", "success");
      localStorage.setItem("bmhUserHasParticipated", "true");
      setHasParticipated(true);
      setSubmitted(true);
    } catch { showToast("Error submitting form. Please try again.", "error"); }
    finally { setLoading(false); }
  };

  const handleReferMore = () => {
    setSubmitted(false)
    setStep(1)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      referrerName: "",
      referrerPhone: "",
      referrerEmail: "",
    })
    // Show form (not the "Already In" screen) when user wants to refer more
    setHasParticipated(false)
  }

  return (
    <div>
      <nav className="navbar"><img src="https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/bemahub-logo.png" alt="Bema Hub Logo" /></nav>
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text"><h1>Get Rewarded. <span>Make it Count.</span></h1><p>Use your network to fuel real opportunity</p></div>
          <div className="hero-image"><img src="https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/flyer.webp?t=1694967912" alt="Bema Hub" /></div>
        </div>
      </div>
      <div className="main">
        <div className="form-section">
          {hasParticipated && !submitted ? (
            <div id="whatsappContent" className="whatsapp-section show">
              <div className="whatsapp-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" width="80px" height="80px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></div>
              <h3>You&apos;re Already In!</h3>
              <p className="step-description">You&apos;ve already joined the waitlist. Join our WhatsApp community to stay connected!</p>
              <div className="flex flex-col gap-3">
                <Button asChild className="bg-[#25D366] hover:bg-[#1fb855]">
                  <a href="https://chat.whatsapp.com/FxGza2NSJqYDsMyu2KkVXW?mode=gi_t" target="_blank" rel="noopener noreferrer">JOIN NOW</a>
                </Button>
                <Button onClick={handleReferMore} className="bg-[#d9724d] hover:bg-[#c2643f] text-white">
                  Submit Another
                </Button>
              </div>
            </div>
          ) : submitted ? (
            <div id="whatsappContent" className="whatsapp-section show">
              <div className="whatsapp-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" width="80px" height="80px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></div>
              <h3>Thank You</h3>
              <p className="step-description">Join our WhatsApp community to stay connected and get updates.</p>
              <div className="flex flex-col gap-3">
                <Button asChild className="bg-[#25D366] hover:bg-[#1fb855]">
                  <a href="https://chat.whatsapp.com/FxGza2NSJqYDsMyu2KkVXW?mode=gi_t" target="_blank" rel="noopener noreferrer">JOIN NOW</a>
                </Button>
                <Button onClick={handleReferMore} className="bg-[#d9724d] hover:bg-[#c2643f] text-white">
                  Submit Another
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div id="formContainer" className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div id="formContainer">
              <form id="userForm" onSubmit={handleSubmit}>
                <div className={`form-step ${step === 1 ? "active" : ""}`} id="step1">
                  <h3>Personal Information</h3>
                  <label>First Name *</label>
                  <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" />
                  <label>Last Name *</label>
                  <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" />
                  <label>Email *</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" />
                  <label>Phone *</label>
                  <PhoneInput ref={phoneInputRef} name="phone" value={formData.phone} onChange={(value) => handlePhoneChange("phone", value)} placeholder="Enter your phone number" />
                  <label>Location *</label>
                  <Input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter your location" />
                  <Button type="button" onClick={handleNext} disabled={validating} className="w-full bg-[#d9724d] hover:bg-[#c2643f] text-white uppercase tracking-wide">
                    {validating ? <span className="loader"></span> : "NEXT"}
                  </Button>
                </div>
                <div className={`form-step ${step === 2 ? "active" : ""}`} id="step2">
                  <h3>Referral Information</h3>
                  <p className="step-description">Please provide the details of the person who introduced you to us.</p>
                  <label>Referrer Name *</label>
                  <Input type="text" name="referrerName" value={formData.referrerName} onChange={handleChange} placeholder="Enter referrer's name" />
                  <label>Referrer Phone</label>
                  <PhoneInput ref={referrerPhoneInputRef} name="referrerPhone" value={formData.referrerPhone} onChange={(value) => handlePhoneChange("referrerPhone", value)} placeholder="Enter referrer's phone number" />
                  <label>Referrer Email</label>
                  <Input type="email" name="referrerEmail" value={formData.referrerEmail} onChange={handleChange} placeholder="Enter referrer's email address" />
                  <div className="button-row">
                    <Button type="button" variant="outline" onClick={handleBack} disabled={validating || loading} className="flex-1 bg-[#888] text-white border-[#888] hover:bg-[#666] hover:border-[#666] hover:text-white">BACK</Button>
                    <Button type="submit" disabled={validating || loading} className={`flex-1 bg-[#d9724d] hover:bg-[#c2643f] text-white ${validating || loading ? 'loading' : ''}`}>
                      {validating || loading ? <span className="loader"></span> : "SUBMIT"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="steps-section animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="steps-grid">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="steps-section">
            <h2>Next Steps</h2>
            <div className="steps-grid">
              <div className={`step ${!submitted && !hasParticipated && step === 1 ? "active" : ""}`} id="stepInfo1"><div className="step-number">1</div><div className="step-text">Personal Information</div></div>
              <div className={`step ${!submitted && !hasParticipated && step === 2 ? "active" : ""}`} id="stepInfo2"><div className="step-number">2</div><div className="step-text">Referral Information</div></div>
              <div className={`step ${(submitted || hasParticipated) ? "active" : ""}`} id="stepInfo3"><div className="step-number">3</div><div className="step-text">Join WhatsApp</div></div>
            </div>
          </div>
        )}
      </div>
      <div className="footer-image"><img src="https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/flyer.webp?t=1694967912" alt="Bema Hub" /></div>
    </div>
  );
}
